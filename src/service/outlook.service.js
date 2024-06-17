const axios = require("axios");
const config = require("../config");
const { ElasticSearchService } = require("./elasticsearch.service");

class OutlookServices {
  constructor() {
    this.elasticSearchService = new ElasticSearchService();
  }

  // Outlook Callback
  async callback(query) {
    const { code } = query;
    // validating outlook callback code
    const tokenResponse = await axios.post(
      config.outlook.tokenUrl,
      new URLSearchParams({
        client_id: config.outlook.clientId,
        client_secret: config.outlook.clientSecret,
        code,
        redirect_uri: config.outlook.redirectUrl,
        grant_type: "authorization_code",
      }).toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
    const response = await tokenResponse.data;
    const { access_token, id_token } = response;

    // fetching outlook user profile
    let userInfo = await axios.get(`${config.outlook.graphUrl}/me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    userInfo = userInfo.data;
    const userId = userInfo.id;

    await this.elasticSearchService.add("users", {
      ...userInfo,
      access_token,
      deltaLink: null,
      subscriptionId: null,
      subscriptionExpiration: null,
      mailerType: "outlook",
    });
    this.syncEmails(userId);
    this.subscribeMailbox(userId);
    return userInfo;
  }

  async subscribeMailbox(userId) {
    const user = await this.elasticSearchService.get("users", { id: userId });
    const access_token = user._source.access_token;
    try {
      const response = await axios.post(
        `${config.outlook.graphUrl}/subscriptions`,
        {
          changeType: "created,updated",
          notificationUrl: config.outlook.webhookUrl,
          resource: "me/messages",
          expirationDateTime: new Date(
            Date.now() + 4230 * 60 * 1000
          ).toISOString(),
          clientState: "secretClientValue",
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      // Store the subscription ID and expiration date in Elasticsearch
      await this.elasticSearchService.update("users", userId, {
        subscriptionId: response.data.id,
        subscriptionExpiration: response.data.expirationDateTime,
      });
    } catch (error) {
      console.error("Error subscribing to mailbox:", error);
    }
  }

  // Bulk Sync Email First Time
  async syncEmails(userId) {
    // fetch user from elasticsearch users index
    const user = await this.elasticSearchService.get("users", { id: userId });
    const access_token = user._source.access_token;
    try {
      const deltaLink = user?._source?.deltaLink;
      const emailResponse = await axios.get(
        deltaLink ||
          `${config.outlook.graphUrl}/me/mailfolders/inbox/messages/delta`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const emails = emailResponse.data.value;
      const bulkOps = emails.flatMap((email) => [
        { index: { _index: "email_messages", _id: email.id } },
        {
          // Formatting data accordingly to our system
          user_id: userId,
          email_id: email.id,
          subject: email.subject,
          sender: email.from.emailAddress.address,
          received_date: email.receivedDateTime,
          content: email.body.content,
          hasAttachments: email.hasAttachments,
          isRead: email.isRead,
          isDraft: email.isDraft,
          flag: email?.flag?.flagStatus === "flagged" ? true : false,
          importance: email.importance,

          // Dumping all data, if needed in future
          dump: { ...email },
        },
      ]);
      if (bulkOps.length > 0) {
        await this.elasticSearchService.bulk({ body: bulkOps });
      }
      // Save the deltaLink for the next incremental sync
      const newDeltaLink = emailResponse.data["@odata.deltaLink"];
      await this.elasticSearchService.update("users", userId, {
        deltaLink: newDeltaLink,
      });

      setTimeout(() => this.syncEmails(userId), 60000); // Resync Again
    } catch (error) {
      if (error?.response?.status === 429) {
        const retryAfter =
          parseInt(error?.response?.headers["retry-after"], 10) * 6000;
        setTimeout(() => this.syncEmails(userId), retryAfter);
      } else {
        console.error("Error Bulk Sync Emails:", error);
      }
    }
  }

  async webhook(dto) {
    for (const notification of dto.notifications) {
      const user = await this.getUserIdWebhookNotification(notification); // Implement this function to extract userId from notification
      if (user) {
        await this.processWebhookNotication(user.id, notification);
        this.subscribeMailbox(userId);
      }
    }
  }

  async getUserIdWebhookNotification(data) {
    let users = await this.elasticSearchService.search("users", {
      query: {
        match: {
          mail: data?.resourceData?.toRecipients?.emailAddress?.address,
        },
      },
    });
    if (users.length > 0) {
      return users[0];
    }
    return null;
  }

  async processWebhookNotication(userId, notification) {
    const user = await this.elasticSearchService.get("users", { id: userId });
    const access_token = user?._source?.access_token;
    try {
      const emailResponse = await axios.get(
        `${config.outlook.graphUrl}/me/messages/${notification.resourceData.id}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const email = emailResponse.data;
      const emailDoc = {
        user_id: userId,
        email_id: email.id,
        subject: email.subject,
        sender: email.from.emailAddress.address,
        received_date: email.receivedDateTime,
        content: email.body.content,
        hasAttachments: email.hasAttachments,
        isRead: email.isRead,
        isDraft: email.isDraft,
        flag: email?.flag?.flagStatus === "flagged" ? true : false,
        importance: email.importance,
        dump: { ...email },
      };
      await this.elasticSearchService.add("email_messages", {
        _id: email.id,
        ...emailDoc,
      });
    } catch (error) {
      console.error("Error Notification Email Sync:", error);
    }
  }
}

module.exports = {
  OutlookServices,
};
