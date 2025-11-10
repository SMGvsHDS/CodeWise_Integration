# Stomp

Search
⌘ + k
STOMP
The WebSocket protocol defines two types of messages (text and binary), but their
content is undefined. The protocol defines a mechanism for client and server to negotiate a
sub-protocol (that is, a higher-level messaging protocol) to use on top of WebSocket to
define what kind of messages each can send, what the format is, the content of each
message, and so on. The use of a sub-protocol is optional but, either way, the client and
the server need to agree on some protocol that defines message content.
Section Summary
Overview
Benefits
Enable STOMP
WebSocket Transport
Flow of Messages
Annotated Controllers
Sending Messages
Simple Broker
External Broker
Connecting to a Broker
Dots as Separators
Authentication
Token Authentication
Authorization
User Destinations
Order of Messages
Events
Interception
STOMP Client
WebSocket Scope
Performance
Monitoring
Testing