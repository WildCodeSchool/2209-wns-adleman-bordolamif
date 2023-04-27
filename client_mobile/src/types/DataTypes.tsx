export interface ServicesByWaitingRoom {
    getServicesByWaitingRoomId:[
        {
            __typename:string,
            acronym:string,
            color:string,
            id:number,
            name:string,
            tickets:[
                {
                    __typename:string,
                    id:number,
                    status:number,
                }
            ]
        }
    ]
}
