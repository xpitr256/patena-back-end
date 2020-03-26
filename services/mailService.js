const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs'); //Filesystem

module.exports = {

    sendContactMail2 : function(email, name, message) {
        return new Promise((resolve, reject) => {
            const emailBody = {
                to: 'pablomassuh@gmail.com',
                from: email,
                subject: 'Message from Patena, enviado por ' + name.toString(),
                text: 'Email Contact from Patena',
                //html: '<strong>' + message + '</strong>',
                html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n' +
                    '<html style="width:100%;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">\n' +
                    ' <head> \n' +
                    '  <meta charset="UTF-8"> \n' +
                    '  <meta content="width=device-width, initial-scale=1" name="viewport"> \n' +
                    '  <meta name="x-apple-disable-message-reformatting"> \n' +
                    '  <meta http-equiv="X-UA-Compatible" content="IE=edge"> \n' +
                    '  <meta content="telephone=no" name="format-detection"> \n' +
                    '  <title>PATENA</title> \n' +
                    '  <!--[if (mso 16)]>\n' +
                    '    <style type="text/css">\n' +
                    '    a {text-decoration: none;}\n' +
                    '    </style>\n' +
                    '    <![endif]--> \n' +
                    '  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> \n' +
                    '  <!--[if !mso]><!-- --> \n' +
                    '  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700,700i" rel="stylesheet"> \n' +
                    '  <!--<![endif]--> \n' +
                    '  <style type="text/css">\n' +
                    '@media only screen and (max-width:600px) {p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:32px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:32px!important } h2 a { font-size:26px!important } h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button { font-size:16px!important; display:inline-block!important; border-width:15px 30px 15px 30px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }\n' +
                    '#outlook a {\n' +
                    '\tpadding:0;\n' +
                    '}\n' +
                    '.ExternalClass {\n' +
                    '\twidth:100%;\n' +
                    '}\n' +
                    '.ExternalClass,\n' +
                    '.ExternalClass p,\n' +
                    '.ExternalClass span,\n' +
                    '.ExternalClass font,\n' +
                    '.ExternalClass td,\n' +
                    '.ExternalClass div {\n' +
                    '\tline-height:100%;\n' +
                    '}\n' +
                    '.es-button {\n' +
                    '\tmso-style-priority:100!important;\n' +
                    '\ttext-decoration:none!important;\n' +
                    '}\n' +
                    'a[x-apple-data-detectors] {\n' +
                    '\tcolor:inherit!important;\n' +
                    '\ttext-decoration:none!important;\n' +
                    '\tfont-size:inherit!important;\n' +
                    '\tfont-family:inherit!important;\n' +
                    '\tfont-weight:inherit!important;\n' +
                    '\tline-height:inherit!important;\n' +
                    '}\n' +
                    '.es-desk-hidden {\n' +
                    '\tdisplay:none;\n' +
                    '\tfloat:left;\n' +
                    '\toverflow:hidden;\n' +
                    '\twidth:0;\n' +
                    '\tmax-height:0;\n' +
                    '\tline-height:0;\n' +
                    '\tmso-hide:all;\n' +
                    '}\n' +
                    '</style> \n' +
                    ' </head> \n' +
                    ' <body style="width:100%;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> \n' +
                    '  <div class="es-wrapper-color" style="background-color:#EEEEEE;"> \n' +
                    '   <!--[if gte mso 9]>\n' +
                    '\t\t\t<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">\n' +
                    '\t\t\t\t<v:fill type="tile" color="#eeeeee"></v:fill>\n' +
                    '\t\t\t</v:background>\n' +
                    '\t\t<![endif]--> \n' +
                    '   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> \n' +
                    '     <tr style="border-collapse:collapse;"> \n' +
                    '      <td valign="top" style="padding:0;Margin:0;"> \n' +
                    '       <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> \n' +
                    '         <tr style="border-collapse:collapse;"> \n' +
                    '          <td align="center" style="padding:0;Margin:0;"> \n' +
                    '           <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="600" cellspacing="0" cellpadding="0" align="center"> \n' +
                    '             <tr style="border-collapse:collapse;"> \n' +
                    '              <td align="left" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;padding-bottom:15px;"> \n' +
                    '               <!--[if mso]><table width="580" cellpadding="0" cellspacing="0"><tr><td width="282" valign="top"><![endif]--> \n' +
                    '               <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> \n' +
                    '                 <tr style="border-collapse:collapse;"> \n' +
                    '                  <td width="282" align="left" style="padding:0;Margin:0;"> \n' +
                    '                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td class="es-infoblock es-m-txt-c" align="left" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:arial, \'helvetica neue\', helvetica, sans-serif;line-height:14px;color:#CCCCCC;">Put your preheader text here<br></p></td> \n' +
                    '                     </tr> \n' +
                    '                   </table></td> \n' +
                    '                 </tr> \n' +
                    '               </table> \n' +
                    '               <!--[if mso]></td><td width="20"></td><td width="278" valign="top"><![endif]--> \n' +
                    '               <table class="es-right" cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> \n' +
                    '                 <tr style="border-collapse:collapse;"> \n' +
                    '                  <td width="278" align="left" style="padding:0;Margin:0;"> \n' +
                    '                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="right" class="es-infoblock es-m-txt-c" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:12px;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;line-height:14px;color:#CCCCCC;"><a href="https://viewstripo.email" class="view" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, \'helvetica neue\', helvetica, sans-serif;font-size:12px;text-decoration:none;color:#CCCCCC;">View in browser</a></p></td> \n' +
                    '                     </tr> \n' +
                    '                   </table></td> \n' +
                    '                 </tr> \n' +
                    '               </table> \n' +
                    '               <!--[if mso]></td></tr></table><![endif]--></td> \n' +
                    '             </tr> \n' +
                    '           </table></td> \n' +
                    '         </tr> \n' +
                    '       </table> \n' +
                    '       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> \n' +
                    '         <tr style="border-collapse:collapse;"></tr> \n' +
                    '         <tr style="border-collapse:collapse;"> \n' +
                    '          <td align="center" style="padding:0;Margin:0;"> \n' +
                    '           <table class="es-header-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#044767;" width="600" cellspacing="0" cellpadding="0" bgcolor="#044767" align="center"> \n' +
                    '             <tr style="border-collapse:collapse;"> \n' +
                    '              <td align="left" bgcolor="#6aa84f" style="Margin:0;padding-top:35px;padding-bottom:35px;padding-left:35px;padding-right:35px;background-color:#6AA84F;"> \n' +
                    '               <!--[if mso]><table width="530" cellpadding="0" cellspacing="0"><tr><td width="340" valign="top"><![endif]--> \n' +
                    '               <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> \n' +
                    '                 <tr style="border-collapse:collapse;"> \n' +
                    '                  <td class="es-m-p0r es-m-p20b" width="340" valign="top" align="center" style="padding:0;Margin:0;"> \n' +
                    '                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;font-size:36px;font-style:normal;font-weight:bold;color:#FFFFFF;">Patena<span style="background-color:#800000;"></span></h1></td> \n' +
                    '                     </tr> \n' +
                    '                   </table></td> \n' +
                    '                 </tr> \n' +
                    '               </table> \n' +
                    '               <!--[if mso]></td><td width="20"></td><td width="170" valign="top"><![endif]--> \n' +
                    '               <table cellspacing="0" cellpadding="0" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                 <tr class="es-hidden" style="border-collapse:collapse;"> \n' +
                    '                  <td class="es-m-p20b" width="170" align="left" style="padding:0;Margin:0;"> \n' +
                    '                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;line-height:21px;color:#FFFFFF;text-align:right;"><em>Resultados</em></p></td> \n' +
                    '                     </tr> \n' +
                    '                   </table></td> \n' +
                    '                 </tr> \n' +
                    '               </table> \n' +
                    '               <!--[if mso]></td></tr></table><![endif]--></td> \n' +
                    '             </tr> \n' +
                    '           </table></td> \n' +
                    '         </tr> \n' +
                    '       </table> \n' +
                    '       <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> \n' +
                    '         <tr style="border-collapse:collapse;"> \n' +
                    '          <td align="center" style="padding:0;Margin:0;"> \n' +
                    '           <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> \n' +
                    '             <tr style="border-collapse:collapse;"> \n' +
                    '              <td style="Margin:0;padding-bottom:35px;padding-left:35px;padding-right:35px;padding-top:40px;background-color:#F7F7F7;" bgcolor="#f7f7f7" align="left"> \n' +
                    '               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                 <tr style="border-collapse:collapse;"> \n' +
                    '                  <td width="530" valign="top" align="center" style="padding:0;Margin:0;"> \n' +
                    '                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="center" style="Margin:0;padding-top:20px;padding-bottom:25px;padding-left:35px;padding-right:35px;font-size:0px;"><a target="_blank" href="https://viewstripo.email/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;font-size:15px;text-decoration:none;color:#ED8E20;"><img src="https://fdcgsn.stripocdn.email/content/guids/6b8f5362-ab6a-4eeb-a3a0-db1a2d9b50d7/images/47371584289914761.png" alt="ship" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" title="ship" width="150"></a></td> \n' +
                    '                     </tr> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="center" style="padding:0;Margin:0;padding-bottom:15px;"><h2 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#333333;">Su análisis está listo</h2></td> \n' +
                    '                     </tr> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td class="es-m-txt-l" align="left" style="padding:0;Margin:0;padding-top:20px;"><h3 style="Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#333333;">Hola pablomassuh@gmail.com,</h3></td> \n' +
                    '                     </tr> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="left" style="padding:0;Margin:0;padding-bottom:10px;padding-top:15px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;line-height:24px;color:#777777;">Su análisis ha finalizado, por favor ingrese al siguiente link para ver los resultados</p></td> \n' +
                    '                     </tr> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-bottom:20px;padding-top:25px;"><span class="es-button-border" style="border-style:solid;border-color:transparent;background:#ED8E20 none repeat scroll 0% 0%;border-width:0px;display:inline-block;border-radius:5px;width:auto;"><a href="https://viewstripo.email" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#ED8E20;border-width:15px 30px;display:inline-block;background:#ED8E20 none repeat scroll 0% 0%;border-radius:5px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Ver resultados</a></span></td> \n' +
                    '                     </tr> \n' +
                    '                   </table></td> \n' +
                    '                 </tr> \n' +
                    '               </table></td> \n' +
                    '             </tr> \n' +
                    '           </table></td> \n' +
                    '         </tr> \n' +
                    '       </table> \n' +
                    '       <table class="es-footer" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"> \n' +
                    '         <tr style="border-collapse:collapse;"> \n' +
                    '          <td align="center" style="padding:0;Margin:0;"> \n' +
                    '           <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;"> \n' +
                    '             <tr style="border-collapse:collapse;"> \n' +
                    '              <td align="left" style="Margin:0;padding-top:35px;padding-left:35px;padding-right:35px;padding-bottom:40px;"> \n' +
                    '               <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                 <tr style="border-collapse:collapse;"> \n' +
                    '                  <td width="530" valign="top" align="center" style="padding:0;Margin:0;"> \n' +
                    '                   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="center" style="padding:0;Margin:0;padding-bottom:15px;font-size:0;"><img src="https://fdcgsn.stripocdn.email/content/guids/CABINET_75694a6fc3c4633b3ee8e3c750851c02/images/12331522050090454.png" alt="Beretun logo" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;" title="Beretun logo" width="37"></td> \n' +
                    '                     </tr> \n' +
                    '                     <tr style="border-collapse:collapse;"> \n' +
                    '                      <td align="center" style="padding:0;Margin:0;padding-bottom:35px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:14px;font-family:\'open sans\', \'helvetica neue\', helvetica, arial, sans-serif;line-height:21px;color:#333333;"><b>UBA - Facultad de Ciencias Exactas</b></p></td> \n' +
                    '                     </tr> \n' +
                    '                   </table></td> \n' +
                    '                 </tr> \n' +
                    '               </table></td> \n' +
                    '             </tr> \n' +
                    '           </table></td> \n' +
                    '         </tr> \n' +
                    '       </table></td> \n' +
                    '     </tr> \n' +
                    '   </table> \n' +
                    '  </div>  \n' +
                    ' </body>\n' +
                    '</html>'
            };

            sgMail.send(emailBody, function(err, json) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    },


    sendContactMail : function(email, name, message) {
        return new Promise((resolve, reject) => {

            const htmlContent = fs.readFileSync("./services/emailTemplates/workInProgress.html","utf-8");

            const emailBody = {
                to: 'pablomassuh@gmail.com',
                from: email,
                subject: 'PATENA - Nuevo Diseño de Linker',
                html: htmlContent
            };

            sgMail.send(emailBody, function(err, json) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        })
    }

};
