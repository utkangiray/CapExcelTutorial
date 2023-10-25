namespace utkandemoexcel;
using { managed } from '@sap/cds/common';

    entity Users  {
        key UserUUID : UUID;
        FirstName: String;
        LastName: String;
        Address: String;
        Status: String(1);
    }