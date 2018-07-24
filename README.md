# loopback-microservice

Thin layer to wrap the loopback application for easier testing and sharing of functionality between 
repositories.

## Important

We found out that some of the functionality of `Loopback` depends on the state of the application.
Especially the `app.get` method we use to access configuration does only work correctly after the 
boot process. For now we don't have the resources to refactor the package accordingly, so please be 
aware that the following instance methods will only work correctly after the service/app is booted:

  - `getName`
  - `getLogger`
  - `start`

## General

Install it via npm:

```Bash
npm install @joinbox/loopback-microservice
```

You can start your microservice using the static `start` method:

```Javascript
    const Microservice = require('@joinbox/loopback-microservice');
    const service = await Microservice.start();
```

Starting the service will boot the microservice (using `loopback-boot` with default configuration) and start the 
internal server. Sometimes you don't need the server to be listening to the interface (_i.e._ for scripting) and only 
want access to configured models and the datasources. Therefore you can boot the application:

```Javascript
    const Microservice = require('@joinbox/loopback-microservice');
    const service = await Microservice.boot();
    // access the loopback application
    const loopbackApp = service.app;
    const models = loopbackApp.models;
```

Both examples rely on a default configuration of the microservice itself and especially Loopback's 
boot process. Both methods (`Microservice.boot()`, `Microservice.start`) accept an options object 
which is directly passed to the `Microservice` constructor. 

Especially important is the (optional )`boot` property of this options which are directly passed to 
`loopback-boot` _i.e._ the compiler. The `boot` object accepts properties such as the `appRootDir`. 
For more  information have a look at  the 
[corresponding documentation](https://apidocs.strongloop.com/loopback-boot/). Having 
custom boot options allows you to boot an application from different sources.

> **Note:** Starting multiple instances of a Loopback app within the same process leads to shared
state between them (might be due to the registry)!!

These factory methods are only for convenience. You can always setup a `Microservice` by passing 
your own app instance:

```Javascript
    const boot = {appRootDir: '/home/apps/loopback/demo'};
    const options = { boot };
    // previously: new Microservice(loopbackApp, boot);
    const service = new Microservice(loopbackApp, options);

    await service.boot();
    await service.start();
```

> **Note** Previous versions of the package directly expected the boot options to be passed to the
constructor. This has changed in version 1.0.0

## Configuration

While we currently do not really use any configuration options, the `Microservice` consumes the
`microservice` config section of your Loopback apps config (e.g. `config.json`). The only value it 
currently reads is the `name` property (available as `service.getName()`).

```Json
{
    "microservice": {
        "name": "my-service"
    }
}
```

## API

As soon as the server is running, the `Microservice` instance provides an `api` property, a thin client wrapping 
[superagent](https://visionmedia.github.io/superagent/), preserving the location of the api. To access your models, 
you can perform queries as follows

```Javascript
    const service = await Microservice.start();
    // returns a superagent get query builder bound to protocol, host, port, and base path
    service.api.get('/entities');
```

Using this api client is especially useful for integration testing.

## Error Handling

The package exposes a custom error class and a basic error handler, useful for typed error handling.
This allows you to  differentiate between your errors and errors caused by the rest of the 
application and simplifies error tracing.

One can pass additional data to the error by passing an additional object to the constructor, which is assigned to the error
instance.

```Javascript
    const { MicroserviceError } = require('@joinbox/loopback-microservice');
    class MyServiceError extends MicroserviceError {}
    
    // usage
    try {
        throw new MyServiceError('An error message', {
                status: 400,
                code: 'HOLY_MOLY',
                original: previousError
            });
    } catch (error) {
        if(error instanceof MyServiceError){
            // handle your errors
            if(error.status === 400){
            }
        }
        throw error;
    }
```

> **Note**: The error class was (and still is for backwards compatibility) previously exposed as 
Error. Since this might lead to unwanted side effects when using destructuring - _i.e._ would override
the standard Error class - we also expose it at the `MicroserviceError` property.

### Error Handler

The error handler middleware is a simple wrapper for the [strong-error-handler](https://github.com/strongloop/strong-error-handler).
All of the configuration you pass will be directly forwarded to the strong-error-handler.

Hook in the microservice-error-handler in your `middleware.json`. Sadly, the error handler does not
seem to have access to the app and its configuration. Therefore you need to add the name of your
service to the error handler too. You can add it using the `serviceName` property or copy the global
config of your microservice:

```Json
{
    "final:after": {
        "@joinbox/loopback-microservice#errorHandler": {
            "params": {
                "serviceName": "your-service",
                "microservice": "${microservice}"
                // additional stuff for the strong error handler
            }
        }
    }
}
```

This will enrich the error included in your responses with the `serviceName` property.

> *Note:* If you use strong-remoting and want failing requests to your rest api (ie invalid routes)
to be handled by the same error handler, you have to disable the error handling in the remoting
config of your config.json:

```Json
    "remoting": {
        "rest": {
            "handleErrors": false
        }
    }
``` 

## Testing

Check the `package.json` to see how to execute tests:

  - **all:** `npm test`
  - **unit:** `npm run test:unit`
  - **integration:** `npm run test:integration`
  - **watch tests during development:** `npm run test:watch` (uses mocha's `--watch` option)
  - **linting:** `npm run lint`
  
## Todo

  - expose useful functionality for accessing models
  - expose useful functionality for testing purposes