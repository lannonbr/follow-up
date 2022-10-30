const { Stack, RemovalPolicy } = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const dynamodb = require("aws-cdk-lib/aws-dynamodb");
const {
  GithubActionsRole,
  GithubActionsIdentityProvider,
} = require("aws-cdk-github-oidc");

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

    table.grantReadWriteData(macMini);
    table.grantReadWriteData(macbookPro);

    const provider = GithubActionsIdentityProvider.fromAccount(
      this,
      "GitHubOIDCProvider"
    );

    const siteRole = new GithubActionsRole(this, "FollowUpSiteRole", {
      provider,
      owner: "lannonbr",
      repo: "follow-up",
      filter: "ref:refs/heads/main",
    });

    table.grantReadData(siteRole);
  }
}

module.exports = { FollowUpStack };
