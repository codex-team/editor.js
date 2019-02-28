# Editor.js Events Module

Module allows Developers to subscribe on events or trigger own events

## Methods

### On

```javascript
Events.on(eventName, callback)
``` 

> Method subscribes callback on event. It will be called when Editor.js emits this event

#### params

| Param        | Type | Description|
| -------------|------ |:-------------:|
| eventName        | String | event name|
| callback | Function | event callback|

### Off

```javascript
Events.off(eventName, callback)
``` 

> Method unsubscribes callback on event

#### params

| Param        | Type | Description|
| -------------|------ |:-------------:|
| eventName        | String | event name|
| callback | Function | event callback|

### Emit

```javascript
Events.emit(eventName, data)
``` 

> Method emits data to all subscribed callbacks

#### params

| Param        | Type | Description|
| -------------|------ |:-------------:|
| eventName        | String | event name|
| data | Object | any data|
