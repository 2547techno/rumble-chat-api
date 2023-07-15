# Routes

## `/chat/:video`

Get the stream ID of a video

### Params

`video`: The video ID or slug, example:

-   `v2o2oe5-synthwave-radio-beats-to-chillgame-to.html`
-   `v2o2oe5`

### Response

```ts
{
    "streamId": number
}
```

## `/chat/channel/:channel`

Get the stream ID of channel's latest video/stream.

ie. The video that is served when going to `https://rumble.com/c/channel_name/live/`

### Params

`channel`: The channel name

### Response

```ts
{
    "streamId": number
}
```

## `/events/chat/:id`

Receive chat message events

### Params

`id`: Stream ID

### Reponse

SSE stream of chat messages of type `Message[]`

```ts
type User = {
    id: string;
    username: string;
    isFollower: boolean;
    profilePicture?: URL;
    color: string;
};

type Message = {
    id: string;
    timestamp: string;
    text: string;
    from: User;
};
```

## `/emotes/:sid`

Get list of emotes for stream

### Params

`sid`: Stream ID

### Response

List of emotes of type `Emote[]`

```ts
type Emote = {
    id: number;
    name: string;
    packId: number;
    emotesPackId: number;
    isSubsOnly: boolean;
    moderationStatus: string;
    file: string;
};
```
