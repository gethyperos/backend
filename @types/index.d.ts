/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */

declare namespace HyperAPI {
  interface IUserPayload {
    id: number
    name: string
    token: string
    avatar: string
  }

  interface IAppRepository {
    id: string
    name: string
    description: string
    icon?: string
    manifest: string
    metadata: string
    categories: string[]
  }

  interface IDockerContainer {
    name: string
    Image: string
    Cmd?: string[]
    Env?: string[],
    Volumes?: { [key: string]: {} }
    /**
     * { "<number>/<protocol>: { }"}
     */
    ExposedPorts?: { [key: string]: {} }
    HostConfig: {
      /**
       * [ "/path/to:/path/to" ] 
       */
      Binds?: string[]
      /**
       * { "<number>/<protocol>: [ { "HostPort": "<number>" } ]"}
      */
      PortBindings?: { [key: string]: { 'HostPort': string }[] }
      Privileged?: boolean
      CapAdd?: string[]
      CapDrop?: string[]
      Devices?: { 'PathOnHost': string, 'PathInContainer': string, 'CGroupPermission'?: string }[]
      /**
       * [ "name=<value>" ] 
       * 
       * [ "name=<value>,profile=<value>" ]
       */
      SecurityOpt?: string[]
    },
    RestartPolicy?: { Name: string }
    Labels: { [key: string]: string }
  }
}

declare namespace Express {
  interface Request {
    user: HyperAPI.IUserPayload
  }
}

declare namespace HyperOS {
  export interface IAppRepository {
    /**
     * HyperOS App specifications
     */
    App: {
      /**
       * App Unique Identifier
       */
      id: string
      /**
       * Port for web interface (if any)
       */
      webport: string
      /**
       * App Name
       */
      name: string
      /**
       * App Icon file (relative to app.json)
       */
      icon: string
      /**
       * App Description
       */
      description: string
      /**
       * App Categories (Must exist in categories.json file)
       */
      categories: [string, ...string[]]
      /**
       * Directory name where this app.json is located (Usually the app name)
       */
      directory: string
      /**
       * Port for WEBUI
       */
      webuiPort?: number
      [k: string]: unknown
    }
    /**
     * Docker-compose style services list but expanded to allow Volta customizability
     */
    Services: {
      /**
       * Service
       *
       * This interface was referenced by `undefined`'s JSON-Schema definition
       * via the `patternProperty` "^[a-zA-Z0-9_-]+$".
       */
      [k: string]: {
        /**
         * App Docker images for supported platforms
         */
        images: {
          /**
           * Arm / ArmHF image
           */
          armhf?: string
          /**
           * Arm64 image
           */
          arm64?: string
          /**
           * Default image (32/64bit)
           */
          x86_64: string
        }
        /**
         * Container name, which will be later prefix by vltos-
         */
        container_name: string
        /**
         * Environment variables for the container
         */
        environment?: {
          /**
           * Environment variable name
           */
          name: string
          /**
           * Environment variable value
           */
          value: string
          /**
           * Environment variable description (Used by front-end)
           */
          description?: string
        }[]
        /**
         * Ports for the container
         */
        ports?: {
          /**
           * Port to be exposed on HOST
           */
          host: string
          /**
           * Port on container
           */
          container: string
          /**
           * Protocol (tcp/udp) defaults to tcp
           */
          protocol?: 'tcp' | 'udp'
          /**
           * Port description (Used by front-end)
           */
          description: string
        }[]
        /**
         * Volume bindings for the container
         */
        volumes?: {
          /**
           * Path on host
           */
          host: string
          /**
           * Path on container
           */
          container: string
          /**
           * Volume description (Used by front-end)
           */
          description?: string
        }[]
        /**
         * Devices for the container
         */
        devices?:
        | []
        | [
          {
            /**
             * Path on host
             */
            host: string
            /**
             * Path on container
             */
            container: string
            /**
             * Device description (Used by front-end)
             */
            description?: string
          }
        ]
        /**
         * Capabilities to add to the container
         */
        cap_add?: [string, ...string[]]
        /**
         * Capabilities to drop from the container
         */
        cap_drop?: [string, ...string[]]
        /**
         * Restart policy for the container
         */
        restart: 'no' | 'always' | 'on-failure' | 'unless-stopped'
        /**
         *  set service containers network mode.
         */
        network_mode?: {
          /**
           * Network mode (must include service name if using service mode)
           */
          mode: 'host' | 'none' | 'service'
          /**
           * Service name in case mode = service
           */
          service?: string
        }
        /**
         * logging defines the logging configuration for the service.
         */
        logging?: {
          /**
           * Logging driver
           */
          driver: 'json-file' | 'syslog' | 'journald' | 'gelf' | 'fluentd' | 'fluentbit'
          /**
           * Logging driver options
           */
          options?: {
            /**
             * Logging tag
             */
            tag?: string
          }
        }
        /**
         * security_opt overrides the default labeling scheme for each container.
         */
        security_opt?: [string, ...string[]]
        /**
         * Overrides the command executed on container start-up
         */
        command?: string[]
        depends_on?: string[]
        privileged?: string
      }
    }
  }

}
