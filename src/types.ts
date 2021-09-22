interface AppwriteException {
    code: number;
    response: string;
    message: string;
    name: string;
}

interface RealtimeResponse {
    event: string;
    channels: string[];
    timestamp: number;
    payload: Document;
}

interface AppwritePermissions {
    read: string[];
    write: string[];
}

interface Document {
    $collection: string;
    $id: string;
    $permissions: AppwritePermissions;
}

export {
    AppwriteException,
    RealtimeResponse,
    Document
}