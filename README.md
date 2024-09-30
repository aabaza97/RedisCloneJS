# Table of Contents

- [Table of Contents](#table-of-contents)
- [Redis Clone](#redis-clone)
- [Features](#features)

# Redis Clone

This is a basic Redis-like server implemented in Node.js using TCP sockets. It can handle simple commands like PING, ECHO, SET, GET, and INCR over a TCP connection, similar to how Redis communicates with clients. The project is designed to be easily extensible, allowing new commands to be added with minimal effort.

# Features

**PING**: Responds with PONG to verify the server is alive.

```
PING
+PONG
```

**ECHO**: Returns the input string, similar to Redis's ECHO command.

```
ECHO hey!
+hey!
```

**SET**: Sets a key-value pair, with optional expiry.

```
// set without expiry
SET foo bar
+OK

// set with 1000 milliseconds expiry
SET foo bar px 1000
+OK

SET val 5
```

**GET**: Retrieves the value of a given key.

```
GET foo
+bar
```

**INCR**: Increments the numeric value of a given key.

```
INCR val
+6
```
