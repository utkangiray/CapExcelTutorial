using { utkandemoexcel as my} from '../db/schema';

@path: '/user'
service UserService {
    entity Users as projection on my.Users;
    entity ExcelUpload {
         @Core.MediaType : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        excel : LargeBinary;
    }
}