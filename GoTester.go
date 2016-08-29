package main

import (
	"encoding/json"
	"fmt"
)

type Tester struct {
	ClientIp      string              `json:"clientIp"`
	Uri           string              `json:"uri"`
	AppDefinition AppDefinitionStruct `json:"appDefinition"`
	EventType     string              `json:"eventType"`
	Timestamp     string              `json:"timestamp"`
}
type PortMappingsStruct struct {
	ContainerPort float64 `json:"containerPort"`
	HostPort      float64 `json:"hostPort"`
	ServicePort   float64 `json:"servicePort"`
	Protocol      string  `json:"protocol"`
}
type DockerStruct struct {
	Image          string               `json:"image"`
	Network        string               `json:"network"`
	PortMappings   []PortMappingsStruct `json:"portMappings"`
	Privileged     bool                 `json:"privileged"`
	ForcePullImage bool                 `json:"forcePullImage"`
}
type ContainerStruct struct {
	Type   string       `json:"type"`
	Docker DockerStruct `json:"docker"`
}
type HealthChecksStruct struct {
	Path                   string  `json:"path"`
	Protocol               string  `json:"protocol"`
	PortIndex              float64 `json:"portIndex"`
	GracePeriodSeconds     float64 `json:"gracePeriodSeconds"`
	IntervalSeconds        float64 `json:"intervalSeconds"`
	TimeoutSeconds         float64 `json:"timeoutSeconds"`
	MaxConsecutiveFailures float64 `json:"maxConsecutiveFailures"`
	IgnoreHttp1xx          bool    `json:"ignoreHttp1xx"`
}
type UpgradeStrategyStruct struct {
	MinimumHealthCapacity float64 `json:"minimumHealthCapacity"`
	MaximumOverCapacity   float64 `json:"maximumOverCapacity"`
}
type AppDefinitionStruct struct {
	Id                    string                `json:"id"`
	Instances             float64               `json:"instances"`
	Cpus                  float64               `json:"cpus"`
	Mem                   float64               `json:"mem"`
	Disk                  float64               `json:"disk"`
	Ports                 []float64             `json:"ports"`
	RequirePorts          bool                  `json:"requirePorts"`
	BackoffSeconds        float64               `json:"backoffSeconds"`
	BackoffFactor         float64               `json:"backoffFactor"`
	MaxLaunchDelaySeconds float64               `json:"maxLaunchDelaySeconds"`
	Container             ContainerStruct       `json:"container"`
	HealthChecks          []HealthChecksStruct  `json:"healthChecks"`
	UpgradeStrategy       UpgradeStrategyStruct `json:"upgradeStrategy"`
	Version               string                `json:"version"`
}

func main() {

	jsontest := []byte(`{
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
                "image": "docker-registry.ems.com/nitrogen:blue",
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
}`)

	var test Tester

	_ = json.Unmarshal(jsontest, &test)

	fmt.Printf("Unmarshalled structs: \n%+v", test)

	new_json, _ := json.Marshal(test)

	fmt.Printf("\n\nMarshalled back to JSON:\n%s", string(new_json))
}
