# Follow Up

A project to keep track of links and pages that interest me.

This includes a:

- CDK project for provisioning AWS resources
- [Script Kit](https://github.com/johnlindquist/kit) function for actually saving the links
- [Eleventy](https://www.11ty.dev/) website to publicly display links.

## Future Ideas

In the future I am interested in ideas like:

- a weekly email of all of the previous week's links
- an email that fetches a random link from the past

## CDK Setup

```
npm install
npx aws-cdk deploy
```

I then open the AWS Management Console to the IAM section and manually create access tokens for each user (one user per computer) that I generated and then save the tokens into my `~/.kenv/.env` under `FOLLOW_UP_AWS_ACCESS_KEY_ID` and `FOLLOW_UP_AWS_SECRET_ACCESS_KEY`. I also save in there the created DynamoDB table name under `FOLLOW_UP_TABLE_NAME`.

## Script Kit setup

Copy the `functions/save-a-link.js` script into your kenv environment.

Then you should be able to either run it from the script listing or press `opt+l` and start saving links. I use Microsoft Edge, but feel free to change the browser it pulls from within your instance of the script.
