# CodeX Editor Events Module

Module allows Developers subscribe on events or trigger callbacks

## Methods

### On

```javascript
Events.on(eventName, callback)
``` 

> Method subscribes callback on event. It will be called when CodeX Editor emits this event

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
