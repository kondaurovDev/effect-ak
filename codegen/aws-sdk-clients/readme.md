# AWS SDK Clients Code Generator ![NPM Version](https://img.shields.io/npm/v/@effect-ak/codegen-aws-sdk-clients)<br>

## Why This Package? Motivation Behind Its Creation

I've frequently used the AWS JavaScript SDK clients directly across various projects. These clients allow relatively straightforward interaction with AWS resources.

While these clients are written in TypeScript and are generally convenient to use, they present several challenges that make their application in projects less than ideal.

### Key Issues Identified

#### Client Selection and Command Execution

When using an SDK client, the SDK offers two types of clients to choose from:

1. **Bare-Bones Client**: You create command objects and use the `send` method to execute them.
2. **Full Client with Methods**: You utilize methods directly, passing the command as the first argument.

Essentially, you need to decide which type of client to instantiate.

I prefer the `send` method approach but dislike having to import the client class and instantiate it manually. I would like a more streamlined interface where the first argument is the method name and the second is an object containing the command parameters.

```typescript
client.execute("getObject", { 
  S3Key: "myBucket", 
  S3ObjectName: "myFile" 
});
```

#### Error Handling

Error handling is a crucial aspect. These clients consistently throw errors, whether it's an internal 500 error from AWS or a simple 404 when retrieving an object from an S3 bucket.

With SDK v3, error classes were introduced, allowing you to catch errors and compare them using `instanceof` with the corresponding error class. However, these error classes are not significantly different in their object structure—all such error classes have a `name: string` property that contains the error name.

In my opinion, working with errors (e.g., object not found in a bucket or a Lambda function already exists) should be simpler than importing error classes and comparing them using `instanceof`, which introduces additional boilerplate code.

Ideally, I want a list of possible error names. I don’t need the classes; knowing the error name is sufficient.

## The Solution: A Code Generator

If I'm not mistaken, there are currently around 400 SDK clients. Different projects use different clients based on their specific needs. Therefore, the only viable solution is to generate the code for these clients directly within the projects where they are used.

### What Does It Generate?

- **Error Names Array**: Creates an array containing all the error names for the SDK client.
- **Client Interface**: Defines an interface describing all possible methods supported by the SDK client and their return types.
- **Client Wrapper**: Generates a wrapper that initializes the SDK client and invokes its methods. This wrapper functions as an [Effect](https://effect.website/) service, ensuring that the SDK client is properly closed when the program terminates. The generated code requires `effect: ^3.10.0`.

## How to Use It in Your Project

### Install the Code Generator as a Development Dependency

Add the code generator to your project’s dev dependencies:

```json
{
  "devDependencies": {
    "@effect-ak/codegen-aws-sdk-clients": "^0.0.1"
  }
}
```

### Run the Code Generation

Execute the following command to generate the SDK clients:

```bash
npx codegen-aws-sdk-clients
```

### Optional: Create a Configuration File

Create a `codegen-aws-sdk-clients.json` file in the root of your project to customize the generator’s settings.

## Example Usage

Here’s how you can use the generated SDK client in your project:

```typescript
import { Effect, Console } from "effect";

import { S3ClientService, recoverFromS3Exception } from "../../clients/s3.js"; // path to generated code

const displayNumberOfObjectsInBucket = Effect.gen(function* () {
  const s3 = yield* S3ClientService;

  const files = yield* s3.execute("listObjectsV2", {
    Bucket: "myBucket",
  }).pipe(
    recoverFromS3Exception("NoSuchBucket", { KeyCount: 0 })
  );

  yield* Console.log("Total number of objects:", files.KeyCount);
})
.pipe(
  Effect.provide(S3ClientService.Default)
);

await Effect.runPromise(displayNumberOfObjectsInBucket);
```
