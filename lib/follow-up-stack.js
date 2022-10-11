const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");

class FollowUpStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "LinksTable", {
      partitionKey: {
        name: "year_month",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.RETAIN,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    const macMini = new iam.User(this, "MacMiniUser", {});
    const macbookPro = new iam.User(this, "MacbookProUser", {});

    table.grantWriteData(macMini);
    table.grantWriteData(macbookPro);
  }
}

module.exports = { FollowUpStack };
