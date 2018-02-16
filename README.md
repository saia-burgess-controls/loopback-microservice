# loopback-microservice

Thin layer to wrap the loopback application for easier testing and sharing of functionality between repositories.

## General

Installation currently only via git repos, _i.e._ `"loopback-microservice": "git@github.com:joinbox/loopback-microservice.git"`
in your `package.json`.

You can start your microservice using the static `start` method:

```Javascript
    const Microservice = require('loopback-microservice');
    const service = await Microservice.start();
```

Starting the service will boot the microservice (using `loopback-boot` with default configuration) and start the 
internal server. Sometimes you don't need the server to be listening to the interface (_i.e._ for scripting) and only 
want access to configured models and the datasources. Therefore you can boot the application:

```Javascript
    const Microservice = require('loopback-microservice');
    const service = await Microservice.boot();
    // access the loopback application
    const loopbackApp = service.app;
    const models = loopbackApp.models;
```

Both examples rely on a default configuration during the boot process (letting loopback handle the configuration).
Both methods (`Microservice.boot()`, `Microservice.start`) accept an options object which is directly passed to 
`loopback-boot` _i.e._ the compiler. The `options` object accepts properties such as the `appRootDir`. For more 
information have a look at the [corresponding documentation](https://apidocs.strongloop.com/loopback-boot/). Having 
custom boot options allows you to boot an application from different sources.

These factory methods are only for convenience. You can always setup a `Microservice` by passing your own app instance:

```Javascript
    const bootOptions = {appRootDir: '/home/apps/loopback/demo'};
    const service = new Microservice(loopbackApp, bootOptions);
    await service.boot();
    await service.start();
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

The package exposes a custom error class, useful for typed error handling. This allows you to 
differentiate between your errors and errors caused by the rest of the application.

One can pass additional data to the error by passing an additional object to the constructor, which is assigned to the error
instance.

```Javascript
    const MicroserviceError = require('loopback-microservice').Error;
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