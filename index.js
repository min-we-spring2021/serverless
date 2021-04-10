var aws = require("aws-sdk");
var ses = new aws.SES({ region: "us-east-1" });

const ddb = new aws.DynamoDB({ params: { TableName: "dynamodb6225" } });
exports.handler = function (event) {
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
        const itemParams = {
            Item: {
                'id': { S: mes.BookID }
            }
        };
        const itemFind = {
            Key: {
                'id': { S: mes.BookID }
            }
        };
        ddb.getItem(itemFind, function (err, data) {
            if (err || data.Item == undefined) {
                ddb.putItem(itemParams, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } else {
                        return ses.sendEmail(params).promise()
                    }
                });
            } else {
                console.log("you have send email before", data.Item);
            }
        });

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
        const itemFind = {
            Key: {
                'id': { S: mes.BookID }
            }
        };
        ddb.getItem(itemFind, function (err, data) {
            if (err || data.Item == undefined) {
                console.log("you have delete email before", data.Item);
            } else {
                ddb.deleteItem(itemFind, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } else {
                        return ses.sendEmail(params).promise()
                    }
                });
            }
        });
    }
};