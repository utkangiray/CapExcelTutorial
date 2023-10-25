 const cds = require('@sap/cds');
 const { Readable, PassThrough } = require('stream')
 const XLSX = require('xlsx');

 module.exports = cds.service.impl(async function(srv){
    srv.on('PUT', "ExcelUpload", async (req, next) => {
        if (req.data.excel) {
            var entity = req.headers.slug;
            const stream = new PassThrough();
            var buffers = [];
            req.data.excel.pipe(stream);
            await new Promise((resolve, reject) => {
                stream.on('data', dataChunk => {
                    buffers.push(dataChunk);
                });
                stream.on('end', async () => {
                    var buffer = Buffer.concat(buffers);
                    var workbook = XLSX.read(buffer, { type: "buffer", cellText: false, cellDates: true, dateNF: 'dd"."mm"."yyyy', cellNF: true, rawNumbers: false });
                    let data = []
                    const sheets = workbook.SheetNames
                    for (let i = 0; i < sheets.length; i++) {
                        const temp = XLSX.utils.sheet_to_json(
                            workbook.Sheets[workbook.SheetNames[i]], { cellText: false, cellDates: true, dateNF: 'dd"."mm"."yyyy', rawNumbers: false })
                        temp.forEach((res, index) => {
                            if (index === 0) return;
                            data.push(JSON.parse(JSON.stringify(res)))
                        })
                    }
                    if (data) {
                            const responseCall = await CallEntity(entity, data);
                            if (responseCall == -1)
                                reject(req.error(400, JSON.stringify(data)));
                            else {
                                resolve(req.notify({
                                    message: 'Upload Successful',
                                    status: 200
                                }));   
                        }
                    }
                });
            });
        } else {
            return next();
        }
    });
    
    srv.before('POST', 'Users', async (req) => {
    //Custom validations can be put, if required before upload
    });
    srv.on('POST', 'Users', async (req) => {
     //return reponse to excel upload entity .
    });
    
    async function CallEntity(entity, data) {
    if (entity === 'Users') {
      //If any custom handling required for a particular entity
    }
    const insertQuery = INSERT.into(entity).entries(data); 
    // This calls the service handler of respective entity. It can be used if any custom 
    //validations need to be performed. or else custom handlers can be skipped. 
    
    let srv = await cds.connect.to('UserService');
    const insertResult = await srv.run(insertQuery).then( (resolve, reject) => {
        if(resolve) {
            insertQuery.data;
        }
        else {
            insertQuery
        }
    } );
    let query = SELECT.from(entity);
    await srv.run(query);
    return insertResult; //returns response to excel upload entity
    
    };
 })


// module.exports = (srv) => { 
// srv.on('PUT', "ExcelUpload", async (req, next) => {
//     if (req.data.excel) {
//         var entity = req.headers.slug;
//         const stream = new PassThrough();
//         var buffers = [];
//         req.data.excel.pipe(stream);
//         await new Promise((resolve, reject) => {
//             stream.on('data', dataChunk => {
//                 buffers.push(dataChunk);
//             });
//             stream.on('end', async () => {
//                 var buffer = Buffer.concat(buffers);
//                 var workbook = XLSX.read(buffer, { type: "buffer", cellText: true, cellDates: true, dateNF: 'dd"."mm"."yyyy', cellNF: true, rawNumbers: false });
//                 let data = []
//                 const sheets = workbook.SheetNames
//                 for (let i = 0; i < sheets.length; i++) {
//                     const temp = XLSX.utils.sheet_to_json(
//                         workbook.Sheets[workbook.SheetNames[i]], { cellText: true, cellDates: true, dateNF: 'dd"."mm"."yyyy', rawNumbers: false })
//                     temp.forEach((res, index) => {
//                         if (index === 0) return;
//                         data.push(JSON.parse(JSON.stringify(res)))
//                     })
//                 }
//                 if (data) {
//                         const responseCall = await CallEntity(entity, data);
//                         if (responseCall == -1)
//                             reject(req.error(400, JSON.stringify(data)));
//                         else {
//                             resolve(req.notify({
//                                 message: 'Upload Successful',
//                                 status: 200
//                             }));   
//                     }
//                 }
//             });
//         });
//     } else {
//         return next();
//     }
// });

// srv.before('POST', 'Users', async (req) => {
// //Custom validations can be put, if required before upload
// });
// srv.on('POST', 'Users', async (req) => {
//  //return reponse to excel upload entity .
// });

// async function CallEntity(entity, data) {
// if (entity === 'Users') {
//   //If any custom handling required for a particular entity
// }
// const insertQuery = INSERT.into(entity).entries(data); 
// // This calls the service handler of respective entity. It can be used if any custom 
// //validations need to be performed. or else custom handlers can be skipped. 

// let srv = await cds.connect.to('ExcelUpload');
// const insertResult = await srv.run(insertQuery);
// let query = SELECT.from(entity);
// await srv.run(query);
// return insertResult; //returns response to excel upload entity

// };
// }