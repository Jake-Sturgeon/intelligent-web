YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [
        "DB-interface",
        "IndexedDB",
        "app",
        "index-routing",
        "map",
        "map-interface",
        "socket-io"
    ],
    "modules": [
        "App",
        "Map - On Document Ready",
        "Routing",
        "Service-Worker",
        "map-module",
        "socket-io"
    ],
    "allModules": [
        {
            "displayName": "App",
            "name": "App",
            "description": "App js. Contains large amount of requirements, as well as being the main source."
        },
        {
            "displayName": "Map - On Document Ready",
            "name": "Map - On Document Ready",
            "description": "Jquery document on ready for mapping module."
        },
        {
            "displayName": "map-module",
            "name": "map-module",
            "description": "Mapping Class, produces the leafletJS front-end creation. Additionally deals with the creation of modals."
        },
        {
            "displayName": "Routing",
            "name": "Routing",
            "description": "Index routes, provides information for main bulk of server. Produces get requests for main websites, as well as creation"
        },
        {
            "displayName": "Service-Worker",
            "name": "Service-Worker",
            "description": "This is the description for my class."
        },
        {
            "displayName": "socket-io",
            "name": "socket-io",
            "description": "Socket io. Contains ability to emit and broadcast necessary socket.io capabilities."
        }
    ],
    "elements": []
} };
});