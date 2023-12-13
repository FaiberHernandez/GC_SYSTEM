function imprimir() {
    window.jsPDF = window.jspdf.jsPDF;
    window.print();
}

function validarNumero(input) {
    // Elimina cualquier carácter que no sea un dígito
    input.value = input.value.replace(/\D/g, '');

    // Convierte el valor a un entero
    var numero = parseInt(input.value, 10);

    // Valida si el número es un entero positivo
    if (isNaN(numero) || numero < 0) {
        // Si el valor no es un número entero positivo, restablece el campo de entrada
        input.value = '';
    }


}

document.getElementById("creditos").addEventListener("input", function () {
    total = document.getElementById("creditos").value * 48;
    document.getElementById("horasT").value = total;
    calcularProporcion(document.getElementById("proporcion"));
});

function calcularProporcion(input) {
    const valor = input.value;
    if (valor) {
        const partes = valor.split(':');
        const n1 = parseInt(partes[0]);
        const n2 = parseInt(partes[1]);

        document.getElementById("horasA").value = Math.round(document.getElementById("horasT").value / (n1 + n2) * n1);
        document.getElementById("horasI").value = Math.round(document.getElementById("horasT").value / (n1 + n2) * n2);
    }
}
$.getJSON('https://api.ipify.org?format=json', function (data) {
    document.getElementById("ip").textContent = "IP: " + data.ip + " - Fecha: " + obtenerFechaActual();
});

// Función para guardar los datos del formulario en un archivo JSON
function guardarDatos() {
    const formulario = document.getElementById('miFormulario');
    const datos = {};

    for (const input of formulario.elements) {
        if (input.name) {
            datos[input.name] = input.value;
        }
    }
    datos["fecha"] = obtenerFechaActual();
    datos["ip"] = document.getElementById("ip").textContent;
    datos["totalra"] = campoIndexRa;
    datos["totalTemas"] = temaIndex;
    datos["totalPresaber"] = presaberIndex;
    datos["totalReferencias"] = referenciasIndex;
    datos["temas"] = temas;
    downloadData(datos);
}

function downloadData(data) {
    const datosJSON = JSON.stringify(data);
    const blob = new Blob([datosJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    if (data["codigo"] != "") {
        a.download = data["codigo"] + '.cum';
    } else {
        a.download = 'datos.cum';
    }
    a.click();
}

function obtenerFechaActual() {
    // Crear un objeto Date
    const fechaActual = new Date();

    // Obtener el día, mes y año
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1; // Nota: los meses en JavaScript comienzan desde 0
    const año = fechaActual.getFullYear();

    // Formatear la fecha
    const fechaFormateada = `${año}-${mes < 10 ? '0' : ''}${mes}-${dia < 10 ? '0' : ''}${dia}`;
    return fechaFormateada;
}

// Función para cargar datos desde un archivo JSON
function cargarDatosDesdeArchivo() {
    const archivoEntrada = document.getElementById('archivoEntrada');
    const file = archivoEntrada.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const datos = JSON.parse(e.target.result);
            console.log(datos);
            const elements = document.getElementById('form').elements;
            for (const input of elements) {
                if (input.name && datos[input.name]) {
                    input.value = datos[input.name];
                }
            }
            $('#unidad').select2({
                placeholder: "< nombre de la unidad académica responsable curricularmente >"
            });
            if (nombre.value) {
                nombre.style.height = (nombre.scrollHeight) + 'px';
            }
            if (descripcion.value) {
                descripcion.style.height = (descripcion.scrollHeight) + 'px';
                handleInputEventForCountWords({ target: descripcion });
            }
            showKnowledgeResults(datos.resultadoAprendizaje);
            showCriteriaTables(datos.criterios);
            showEvidences(datos.evidencias);
            showKnowledgeStructure(datos.temas);
            showRequiredKnowledge(datos.presaber);
            showReferences(datos.referencia);
        };

        reader.readAsText(file);
    }
}

function showKnowledgeResults(results) {
    const criteriaResultTable = document.querySelector("#matriz_table > tbody") ?? document.createElement("tbody");
    knowledgeResults.innerHTML = "";
    resultCriteria.innerHTML = "";
    criteriaResultTable.innerHTML = "";
    for (const result of results) {
        addKnowledgeResult();
    }
    const createdResults = document.getElementsByClassName("knowledge-results__result");
    for (let idx = 0; idx < createdResults.length; idx++) {
        const textarea = createdResults[idx].querySelector("textarea");
        textarea.value = results[idx];
        textarea.style.height = (textarea.scrollHeight + 4) + 'px';
    }

}

function showCriteriaTables(criterios) {
    for (const criterio of criterios) {
        const raRow = document.getElementById("tr" + criterio.ra);
        if (raRow) {
            const textareas = raRow.querySelectorAll("td textarea");
            for (let idx = 0; idx < textareas.length; idx++) {
                textareas[idx].value = criterio.value[idx];
                textareas[idx].style.height = (textareas[idx].scrollHeight + 4) + 'px';
            }
        }
    }
}

function showEvidences(evidencias) {
    if (evidencias && evidencias.length > 0) {
        const tbody = evidencesTable.querySelector("tbody");
        tbody.innerHTML = "";
        for (const evidencia of evidencias) {
            addNewEvidence(evidencia);
            console.log("CDEvidencias: ", evidencia.CDEvaluados, tbody.querySelector("tr:last-child > td:nth-child(4) select"));
            $(tbody.querySelector("tr:last-child > td:nth-child(4) select")).val(evidencia.CDEvaluados);
            $(tbody.querySelector("tr:last-child > td:nth-child(4) select")).trigger('change');

        }
        const textareas = tbody.querySelectorAll("tr > td textarea");
        for (const textarea of textareas) {
            textarea.style.height = (textarea.scrollHeight + 4) + 'px';
        }
        /* const select2textarea = tobyd.querySelectorAll("tr > td:nth-child(4) textarea");
        for(const select2 of select2textarea){
            $(select2).val(selectedCDs).trigger('change');
        } */
    }

}

function showKnowledgeStructure(temas) {
    if (temas && temas.length > 0) {
        const list = document.getElementsByClassName("knowledge-structure__list")[0];
        if (list) {
            list.innerHTML = "";
            for (const tema of temas) {
                addItemInKnowledgeStructure(tema.item);
                for (const subtema of tema.subitems) {
                    const lastLi = document.querySelector(".knowledge-structure__list > li:last-child");
                    addSubitemInItem(lastLi, subtema);
                }
            }
            const textareas = list.querySelectorAll("textarea");
            for (const textarea of textareas) {
                textarea.style.height = (textarea.scrollHeight + 4) + 'px';
            }
        }
    }

}

function showRequiredKnowledge(presaberes) {
    if (presaberes && presaberes.length > 0) {
        const list = document.getElementsByClassName("required-preknowledges__list")[0];
        if (list) {
            list.innerHTML = "";
            for (const presaber of presaberes) {
                addRequiredKnowledge(presaber);

            }
            const textareas = list.querySelectorAll("textarea");
            for (const textarea of textareas) {
                textarea.style.height = (textarea.scrollHeight + 4) + 'px';
            }
        }
    }

}
function showReferences(referencias) {
    if (referencias && referencias.length > 0) {
        const list = document.getElementsByClassName("references__list")[0];
        if (list) {
            list.innerHTML = "";
            for (const referencia of referencias) {
                addReference(referencia);

            }
            const textareas = list.querySelectorAll("textarea");
            for (const textarea of textareas) {
                textarea.style.height = (textarea.scrollHeight + 4) + 'px';
            }
        }
    }

}

function rotatePage() {
    $(".sheet").toggleClass("sheet--horizontal");
}