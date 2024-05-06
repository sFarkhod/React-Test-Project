export interface IinfoMyselfData {
    id: number;
    name: string;
    email: string;
    key: string;
    secret: string;
}

export interface IinfoMyself {
    data: IinfoMyselfData;
    isOk: boolean;
    message: string;
}
