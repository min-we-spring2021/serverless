var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });
exports.handler = async function (event) {
    const message = event.Records[0].Sns.Message;
    const mes = JSON.parse(message);
    if (mes.type === "create") {
        const link = mes.link;
        const params = {
            Destination: {
                ToAddresses: [mes.email],
            },
            Message: {
                Body: {
                    Text: { Data: `Hello,\n You have create a new book in our website,\n link to your book:${link}\nbookID:${mes.BookID}` },
                },
                Subject: { Data: "Create a new book on prod.wenhaom.me" },
            },
            Source: "no-replay@prod.wenhaom.me",
        }
        return ses.sendEmail(params).promise()
    } else {
        const params = {
            Destination: {
                ToAddresses: [mes.email],
            },
            Message: {
                Body: {
                    Text: { Data: `Hello,\n You have delete a new book in our website,bookID:${mes.BookID}` },
                },
                Subject: { Data: "delete a book on prod.wenhaom.me" },
            },
            Source: "no-replay@prod.wenhaom.me",
        }
        return ses.sendEmail(params).promise()
    }
};