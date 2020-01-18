
//Variáveis Globais
var form_action     = $(".fom-action");
var name_c          = $("#name");
var email           = $("#email");
var type_doc        = $("#type_doc");
var number_doc      = $("#number_doc");
var fields          = $(".form-control");

//Escolha do select type_doc
number_doc.prop("disabled", true);
type_doc.change(function () {
    if($(this).val()=="Cedula"){number_doc.prop("disabled", false).mask('0000000000');}
    if($(this).val()=="Cedula extranjería"){
        number_doc.prop("disabled", false).prop("maxlength", 15).mask('#' , {
            maxlength: true,
            translation: {
                '#': {
                    pattern: /[A-zÀ-ÿ0-9]/,
                    recursive: true
                },
            }
        });
    }
    if($(this).val()=="Tarjeta de identidad"){number_doc.prop("disabled", false).mask('0000000000');}
    if($(this).val()==""){number_doc.prop("disabled", true);}
});


//Validação dos campos
function validationField()
{
    var isValid = true;
    fields.each(function() {
        var element = $(this);
        if (element.val() == "") { element.addClass("error_field") ; isValid = false; }
        else { element.addClass("success_field" ) ; }
    });
    if(isValid == false) { Swal.fire("Houve um erro", "Os Campos destacados em vermelho são obrigatórios!", "error"); return false;}
    else { return true; }
}

//Interceptar o submit e realizar as ações para depois validar.
form_action.submit(function () {
    if(validationField()==true)
    {
        let timerInterval;
        Swal.fire({
            title: 'Aguarde o processamento!',
            html: 'Os dados estão sendo enviados para a API.',
            timer: false,
        }).then((result) => {
            if (
                result.dismiss === Swal.DismissReason.timer
            ) {
                console.log('Serei fechado pelo cronômetro!')
            }
        });

        let data =
            {
                service                      : "1",
                forms_id_form                : "988",
                forms_admins_id_admin        : "36",
                content_reg: {
                    "id_form"                     :"988",
                    "admins_id_admin"             :"36",
                    "title_form"                  :"prueba (988)",
                    "description_form"            :"prueba",
                    "fields_form"                 :
                        [
                            {
                                "type"            :"TEXT",
                                "fieldId"         :"fieldType1_combo",
                                "name"            :"nombre",
                                "value"           :name_c,
                                "restrict"        :"NameCharactersAndNumbers"
                            },
                            {
                                "type"            :"TEXT",
                                "fieldId"         :"fieldType2_combo",
                                "name"            :email,
                                "value"           :"[valor_del_campo]",
                                "restrict"        :"NameCharactersAndNumbers"
                            },
                            {
                                "type"            :"TEXT",
                                "fieldId"         :"fieldType3_combo",
                                "name"            :"tipodoc",
                                "value"           :type_doc,
                                "restrict"        :"NameCharactersAndNumbers"
                            },
                            {
                                "type"            :"TEXT",
                                "fieldId"         :"fieldType4_combo",
                                "name"            :"numdoc",
                                "value"           :number_doc,
                                "restrict"        :"NameCharactersAndNumbers"
                            }
                        ],
                    "date_form":"2019-04-29 00:00:00"
                },
                date_reg                     : "2019-04-29"
            };

        fetch('http://hechoparaliderar.com/SIAF/api/php/proxys/regsproxy.php', {
            method   : 'POST',
            body     :  JSON.stringify(data)
        })
        .then(function (response) {
            console.log(response);
            Swal.fire("Sucesso!", "Você enviou os dados para a API!", "success");
            return true;
        })
        .catch(function (response) {
            Swal.fire("Erro no envio", "Ocorreu um erro na requisição!", "error");
        })

    }
    return false;
});