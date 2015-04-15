'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();
var lista;
var persona;



function init() {

    lista = context.get_web().get_lists().getByTitle("ListaPersonas");


}



function crearPersona() {


    var ici = SP.ListItemCreationInformation();
    var item = lista.addItem(ici);

    item.set_item("Nombre", $("#txtNombre").val());
    item.set_item("Anos", $("#txtEdad").val());

    item.update();
    context.load(item);
    context.executeQueryAsync(function () {

        alert("Persona añadida con éxito");
        listadoPersonas();
    },

        function (sender, args) {

            alert(args.get_message());
        }


    );


}


function listadoPersonas() {


    persona = lista.getItems(new SP.CamlQuery());
    context.load(persona);
    context.executeQueryAsync(function () {

        var html = "<ul>";

        var enumeracion = persona.getEnumerator();
        while (enumeracion.moveNext()) {

            var item = enumeracion.get_current();
            html += "<li><a href='#' onclick='cargar(" + item.get_item("ID") + ")'>"
                + item.get_item("Nombre") + "</a></li>";


        }


        html += "</ul>";
        $("#listado").html(html);

    }, function (sender, args) {

        alert(args.get_message());
    });


}

function cargar(id) {


    var enumeracion = persona.getEnumerator();
    while (enumeracion.moveNext()) {
        var item = enumeracion.get_current();
        if (item.get_item("ID") == id) {

            $("#Nombre").html(item.get_item("Nombre"));
            $("#Edad").html(item.get_item("Anos"));
           
            break;
        }
    }
}


function CrearPersonaRest() {

    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('ListaApi')/items";
    var digest = $("#_REQUESTDIGEST").val();
    var obj = {
        Nombre: $("#txtNombre").val(),
        Ano: $("#txtEdad").val()


};
    var objtxt = JSON.stringify(obj);
    $.ajax(
        {
            url: url,
            data: objtxt,
            type: 'POST',
            headers: {
                'accept': 'application/json;odata=verbose',
                'content-type': 'application/json',
                'X-RequestDigest': digest


            },
            succes: function () {
                alert("Nombre añadido con exito");
                listarRest();
            },
            error: function (err) {
                alert(JSON.stringify(err));

            }

        }
    );
}

function listarRest() {
   

    var url = _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getByTitle('ListaApi')/items";
    $.ajax({
        url: url,
        type: "GET",
        headers: { "accept": "application/json;odata=verbose" },
        succes: function(res) {
            var html = "<ul>";


            $.each(res.d.results, function(i, result) {

                html += "<li>" + result.Nombre + "</li>" +
                    "<li>" +
                    result.Ano + "</li>";
            });

            html += "</ul>";     
            $("#listado").html(persona);
        },
       
   
                error: function (err) {
                alert(JSON.stringify(err));
       
        }

    });
   


}





$(document).ready(function () {

    $("#btnEnviar").click(function () {

        crearPersona();
    });

    init();
    listadoPersonas();


});

$(document).ready(function () {

    $("#btnEnviarDos").click(function () {
    CrearPersonaRest();
});

    init();
    listarRest();
    });