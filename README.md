# go-struct-generator
NodeJS script that outputs valid golang structs from arbitrary JSON object strings.


Create a new file named `<your_struct_name>.json` in the json_objects/ directory for each json string you'd like to convert:

```
json_objects/randomJson.json:

{
    "clientIp": "10.74.68.23",
    "uri": "/v2/apps",
    "appDefinition": {
        "id": "/nitrotest",
        "instances": 2,
        "cpus": 0.25,
        "mem": 512,
        "disk": 0,
        "ports": [0],
        "requirePorts": false,
        "backoffSeconds": 1,
        "backoffFactor": 1.15,
        "maxLaunchDelaySeconds": 3600,
        "container": {
            "type": "DOCKER",
            "docker": {
                "image": "docker-registry.ems.homedepot.com/nitrogen:blue",
                "network": "BRIDGE",
                "portMappings": [{
                    "containerPort": 0,
                    "hostPort": 31003,
                    "servicePort": 0,
                    "protocol": "tcp"
                }],
                "privileged": false,
                "forcePullImage": true
            }
        },
        "healthChecks": [{
            "path": "/healthcheck",
            "protocol": "HTTP",
            "portIndex": 0,
            "gracePeriodSeconds": 15,
            "intervalSeconds": 20,
            "timeoutSeconds": 20,
            "maxConsecutiveFailures": 3,
            "ignoreHttp1xx": false
        }],
        "upgradeStrategy": {
            "minimumHealthCapacity": 0.5,
            "maximumOverCapacity": 0.5
        },
        "version": "2016-04-01T16:48:04.485Z"
    },
    "eventType": "api_post_event",
    "timestamp": "2016-04-01T16:48:04.546Z"
}
```

Run `node go-struct-generator.js` and capture the output from the command line, or pipe directly into a golang file (`node go-struct-generator.js >> myStructs.go`):

```
type RandomJson struct {
	ClientIp string `json:"clientIp"`
	Uri string `json:"uri"`
	AppDefinition AppDefinitionStruct  `json:"appDefinition"`
	EventType string `json:"eventType"`
	Timestamp string `json:"timestamp"`
}
type PortMappingsStruct struct {
	ContainerPort float64 `json:"containerPort"`
	HostPort float64 `json:"hostPort"`
	ServicePort float64 `json:"servicePort"`
	Protocol string `json:"protocol"`
}
type DockerStruct struct {
	Image string `json:"image"`
	Network string `json:"network"`
	PortMappings []PortMappingsStruct `json:"portMappings"`
	Privileged boolean `json:"privileged"`
	ForcePullImage boolean `json:"forcePullImage"`
}
type ContainerStruct struct {
	Type string `json:"type"`
	Docker DockerStruct  `json:"docker"`
}
type HealthChecksStruct struct {
	Path string `json:"path"`
	Protocol string `json:"protocol"`
	PortIndex float64 `json:"portIndex"`
	GracePeriodSeconds float64 `json:"gracePeriodSeconds"`
	IntervalSeconds float64 `json:"intervalSeconds"`
	TimeoutSeconds float64 `json:"timeoutSeconds"`
	MaxConsecutiveFailures float64 `json:"maxConsecutiveFailures"`
	IgnoreHttp1xx boolean `json:"ignoreHttp1xx"`
}
type UpgradeStrategyStruct struct {
	MinimumHealthCapacity float64 `json:"minimumHealthCapacity"`
	MaximumOverCapacity float64 `json:"maximumOverCapacity"`
}
type AppDefinitionStruct struct {
	Id string `json:"id"`
	Instances float64 `json:"instances"`
	Cpus float64 `json:"cpus"`
	Mem float64 `json:"mem"`
	Disk float64 `json:"disk"`
	Ports []float64 `json:"ports"`
	RequirePorts boolean `json:"requirePorts"`
	BackoffSeconds float64 `json:"backoffSeconds"`
	BackoffFactor float64 `json:"backoffFactor"`
	MaxLaunchDelaySeconds float64 `json:"maxLaunchDelaySeconds"`
	Container ContainerStruct  `json:"container"`
	HealthChecks []HealthChecksStruct `json:"healthChecks"`
	UpgradeStrategy UpgradeStrategyStruct  `json:"upgradeStrategy"`
	Version string `json:"version"`
}
```


The script can generate valid golang structs for nearly any valid JSON object, with a few constraints:

1. Arrays must contain only elements of the same type. For example, `"myIntArray": [0,1,2]` or `"myStringArray": ["one","two","three"]`, but not `"myMixedArray": [1, "two", 3]`. This rule applies to arrays of objects as well.

2. All numbers are cast to the golang primitive float64.

3. Empty properties will result in empty structs. For example. `"myEmptyProperty":{}` will generate:
    ```
    type MyEmptyPropertyStruct struct {
    }
    ```
    This behavior may or may not be useful to you.

Also included is a little golang script for validating the output of the go-struct-generator. Just replace the included structs with your own output, replace the value of the raw string `jsontest` with the json string you are attempting to convert, and run `go run GoTester.go`. The script will attempt to Unmarshal the json string into the generated structs, and then Marshal the results back into a json object.  
  

Tested using Node version v0.12.7, results with other versions may vary.