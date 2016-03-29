/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'jakemauer',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  
  ENV.contentSecurityPolicy = {
    'default-src': "'none'",
    'script-src': "'self' 'unsafe-eval' 'unsafe-inline' http://*:35729 https://d2wy8f7a9ursnm.cloudfront.net/ heapanalytics.com https://js.intercomcdn.com/ https://widget.intercom.io *.segment.io *.mixpanel.com http://google-analytics.com",
    'font-src': "'self' data: http://fonts.gstatic.com https://fonts.gstatic.com", // Allow fonts to be loaded from http://fonts.gstatic.com
    'connect-src': "'self' notify.bugsnag.com https://gist.githubusercontent.com wss://*.intercom.io *.intercom.io https://api.mixpanel.com cdn.heapanalytics.com *.segment.io *.mixpanel.com http://google-analytics.com"  + ENV.APIRoot, // Allow data (ajax/websocket) from api.mixpanel.com and custom-api.local
    'img-src': "'self' data: *.s3.amazonaws.com *.dropboxusercontent.com *.dropbox.com https://notify.bugsnag.com *.intercomcdn.com heapanalytics.com *.google-analytics.com",
    'style-src': "'self' 'unsafe-inline' http://fonts.googleapis.com https://fonts.googleapis.com", // Allow inline styles and loaded CSS from http://fonts.googleapis.com
    'media-src': "'self'  *.s3.amazonaws.com  *.intercomcdn.com"
  };

  return ENV;
};
