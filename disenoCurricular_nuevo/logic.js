const levels = ["Básico", "Intermedio", "Avanzado", "Excepcional"];
        document.addEventListener("DOMContentLoaded", (event) => {
            const fields = document.getElementsByClassName("count-words");
            console.log("fields", fields);
            for (let field of fields) {
                field.addEventListener("input", (e) => handleInputEventForCountWords(e), true);
            }
            loadPrograms();
            $('#unidad').select2({
                placeholder: "< nombre de la unidad académica responsable curricularmente >"
            });
            loadEducationalLevel();
            createTableCriteriaByRA();
            addKnowledgeResult();
            addNewEvidence();
            addTextareaEventListener(nombre);
            addItemInKnowledgeStructure();
            const olStructure = document.getElementsByClassName("knowledge-structure__list")[0];
            if (olStructure) addSubitemInItem(olStructure.children[0]);
        })

        function handleInputEventForCountWords(event) {
            const e = event;
            const countContainer = document.querySelector('[data-id-input="' + e.target.id + '"]');
            if (countContainer) {
                const wordsCount = e.target.value.trim().split(" ").length;
                const text = wordsCount + " de " + countContainer.dataset.maxWords + " palabras";
                countContainer.innerHTML = text;
            }
            e.target.style.overflow = "hidden";
            const height = e.target.rows ? 26 * e.target.rows : e.target.clientHeight;
            e.target.style.height = e.target.scrollHeight > e.target.clientHeight ? (e.target.scrollHeight) + "px" : height + "px";
        }

        function addKnowledgeResult() {
            const knowledgeResults = document.getElementsByClassName("knowledge-results")[0];
            if (knowledgeResults) {
                const colors = ["#2F5496", "#538135", "#806000", "#2E74B5", "#7B7B7B", "#7030A0", "#C00000", "#00B050", "#A808AC"];
                const ras = knowledgeResults.children;
                const consecutive = ras.length + 1;
                const color = consecutive % colors.length == 0 ? colors[colors.length - 1] : colors[(consecutive % colors.length) - 1];
                const container = createKnowledgeResult(consecutive, color);
                knowledgeResults.appendChild(container);
                //addRACriteriasTable(ras.length, color);
                addRowCriteriaByRA("RA" + consecutive);
            }
        }

        function createKnowledgeResult(consecutive, color) {
            const container = createHTMLElement("div", { className: "knowledge-results__result section__field" });
            const spanColor = document.createElement("span");
            spanColor.style.cssText = "display: inline-block;width: 10px; height: 10px; background: " + color + "; border-radius: 50%;"
            const label = createHTMLElement("label", { htmlFor: "ra" + consecutive, className: "knowledge-results__result__id", innerHTML: spanColor.outerHTML + " RA" + consecutive + "." })
            //label.append(spanColor);
            const textarea = createHTMLElement("textarea", { name: "resultadoAprendizaje", rows: 1, id: "ra" + consecutive, className: "count-words", required: true, maxLength: 500, placeholder: "<Enunciado de un resultado de aprendizaje del curso>" })
            addTextareaEventListener(textarea);
            const removeButton = createHTMLElement("button", { type: "button", className: "knowledge-remove-button", title: "Eliminar resultado de aprendizaje" })
            removeButton.addEventListener("click", () => removeKnowledgeResult(container));
            const spanIconTrash = createHTMLElement("span", { className: "fas fa-times" });
            const spanHiddenTextButton = createHTMLElement("span", { textContent: "ELIMINAR" });
            removeButton.append(spanIconTrash, spanHiddenTextButton);
            container.append(label, textarea, removeButton);
            return container;
        }

        function createHTMLElement(tagname, props) {
            const newElement = document.createElement(tagname);
            for (const [key, value] of Object.entries(props)) {
                newElement[key] = value;
            }
            return newElement;
        }

        function recalculateResultsConsecutive() {
            const knowledgeResults = document.getElementsByClassName("knowledge-results")[0].children;
            if (knowledgeResults) {
                for (let idx = 0; idx < knowledgeResults.length; idx++) {
                    const consecutive = idx + 1;
                    const result = knowledgeResults[idx];
                    const label = result.querySelector("label");
                    if (label) {
                        label.htmlFor = "ra" + consecutive;
                        const foundSpan = label.getElementsByTagName("span")[0];
                        label.innerHTML = foundSpan.outerHTML + "RA" + consecutive + ".";
                    }
                    const textarea = result.querySelector("textarea");
                    if (textarea) {
                        textarea.id = "ra" + consecutive;
                    }
                }
            }
        }

        function removeKnowledgeResult(element) {
            console.log(element.parentNode.children);
            const idxElement = Array.from(element.parentNode.children).indexOf(element);
            element.remove();
            console.log(idxElement);
            removeCriteriaTable(idxElement + 1);
            recalculateResultsConsecutive();
            removeRowCriteriaByRA("RA" + (idxElement + 1));
            setCDsToChoose(true);
        }

        function addRACriteriasTable(consecutiveRA, color) {
            const tables = document.getElementsByClassName("knowledges-result-criterias__tables")[0];
            if (tables) {
                const table = createCriteriasTableFromResult(consecutiveRA, color);
                tables.appendChild(table);
                setCDsToChoose();
            }
        }

        function createCriteriasTableFromResult(consecutiveRA, color) {
            const table = createHTMLElement("table", { id: "tableRA" + consecutiveRA, className: "knowledges-result-criterias__table", "aria-describedby": "tabla RA" + consecutiveRA });
            table.setAttribute("aria-describedby", "tabla RA" + consecutiveRA);
            const thead = createHeadingTableCriteria(consecutiveRA, color);
            const tbody = document.createElement("tbody");
            for (let idx = 0; idx < levels.length; idx++) {
                const levelRow = createLevelRowInTable(consecutiveRA, levels[idx], idx + 1);
                tbody.appendChild(levelRow);
            }
            table.append(thead, tbody);
            return table;
        }

        function createHeadingTableCriteria(consecutive, color) {
            const thead = document.createElement("thead");
            const tableHeadingRARow = document.createElement("tr");
            const tableCell = createHTMLElement("th", { colSpan: 2, scope: "ra", innerHTML: "RA" + consecutive });
            tableCell.style.backgroundColor = color;
            tableHeadingRARow.append(tableCell);
            const tableHeadingTitlesRow = document.createElement("tr");
            const tableNoCell = createHTMLElement("th", { scope: "no", innerHTML: "N" });
            const tableLevelCell = createHTMLElement("th", { scope: "nivel", innerHTML: "Nivel" });
            const tableCriteriaCell = createHTMLElement("th", { scope: "criterio", innerHTML: "Criterio" });
            tableHeadingTitlesRow.append(tableNoCell, tableLevelCell, tableCriteriaCell);
            thead.append(tableHeadingRARow, tableHeadingTitlesRow);
            return thead;
        }

        function createLevelRowInTable(consecutiveRA, levelName, index) {
            const row = document.createElement("tr");
            const tdCDID = createHTMLElement("td", { innerHTML: "CD" + index });
            const tdLevelID = createHTMLElement("td", { innerHTML: levelName });
            const tdCriteria = document.createElement("td");
            const divSectionField = createHTMLElement("div", { className: "section__field section__field--wrap" });
            const idField = `criterio-ra${consecutiveRA}-cd${index}`;
            const labelField = createHTMLElement("label", { htmlFor: idField, className: "section__field--label-no-visible", innerHTML: "Descripción del criterio" });
            const textarea = createHTMLElement("textarea", { name: "criterios", id: idField, rows: 2, class: "count-words", maxLength: 500, placeholder: "<enunciado con el que se expresa el criterio de desempeño definido para evaluar el logro del resultado de aprendizaje a este nivel>" })
            addTextareaEventListener(textarea);
            divSectionField.append(labelField, textarea);
            tdCriteria.append(divSectionField);
            row.append(tdCDID, tdLevelID, tdCriteria);
            return row;
        }

        function removeCriteriaTable(consecutive) {
            const foundTable = document.getElementById("tableRA" + consecutive);
            if (foundTable) {
                foundTable.remove();
                recalculateConsecutiveInTables();
            }
        }

        function recalculateConsecutiveInTables() {
            const tables = document.querySelectorAll(".knowledges-result-criterias__tables")[0].children;
            for (let idx = 0; idx < tables.length; idx++) {
                const consecutive = idx + 1;
                const result = tables[idx];
                result.id = "tableRA" + consecutive;
                result.setAttribute("aria-describedby", "Tabla RA " + consecutive);
                const headingsRA = result.querySelector("thead > tr:nth-child(1) > th:nth-child(1)");
                headingsRA.innerHTML = "RA" + consecutive;
            }
        }

        function createTableCriteriaByRA() {
            const table = createHTMLElement("table", { id: "matriz_table" });
            table.append(createHeadCriteriaByRA());
            const tbody = document.createElement("tbody");
            table.append(tbody);
            document.getElementById("matriz").appendChild(table);
        }

        function createHeadCriteriaByRA() {
            const thead = document.createElement("thead");
            const tr = document.createElement("tr");
            const thRA = createHTMLElement("th", { scope: "RA", textContent: "N" });
            tr.append(thRA);
            for (const level of levels) {
                const thLevel = createHTMLElement("th", { scope: level, textContent: level });
                tr.appendChild(thLevel);
            }
            thead.appendChild(tr);
            return thead;
        }

        function addRowCriteriaByRA(ra) {
            const tbody = document.querySelector("#matriz_table > tbody") ?? document.createElement("tbody")
            const tr = createHTMLElement("tr", { id: "tr" + ra });
            const td = document.createElement("td");
            td.textContent = ra;
            tr.append(td);
            for (const level of levels) {
                const td = document.createElement("td");
                const textarea = createHTMLElement("textarea", { rows: 5, class: "count-words", maxLength: 500, placeholder: "<enunciado con el que se expresa el criterio de desempeño definido para evaluar el logro del resultado de aprendizaje a este nivel>" })
                addTextareaEventListener(textarea);
                td.append(textarea);
                tr.append(td);
            }
            tbody.appendChild(tr);
        }

        function removeRowCriteriaByRA(ra) {
            const tr = document.getElementById("tr" + ra);
            if (tr) {
                tr.remove();
                recalculateRowCriteriaByRA();
            }
        }

        function recalculateRowCriteriaByRA() {
            const rows = document.querySelectorAll("#matriz_table > tbody > tr");
            for (let idx = 0; idx < rows.length; idx++) {
                rows[idx].id = "trRA" + (idx + 1);
                rows[idx].firstChild.textContent = "RA" + (idx + 1);
            }
        }

        function addNewEvidence(value = undefined) {
            const tbody = document.querySelector("#evidencesTable > tbody");
            if (tbody) {
                const newEvidenceRow = addEvidenceRow(value);
                tbody.appendChild(newEvidenceRow);
                setCDsToChoose();

            }
        }

        function setCDsToChoose(update = false) {
            const data = [];
            const tables = document.getElementsByClassName("knowledges-result-criterias__table");
            for (const table of tables) {
                const headerTable = table.querySelector("thead > tr:nth-child(1) th").textContent;
                const CDs = Array.from(table.querySelectorAll("tbody > tr > td:nth-child(1)")).map(cd => cd.textContent);
                data.push({
                    ra: headerTable,
                    CDs: CDs
                });
            }
            const options = [];
            data.forEach(d => {
                for (const cd of d.CDs) {
                    options.push({
                        id: d.ra + "-" + cd,
                        text: d.ra + "-" + cd
                    });
                }
            })
            /* console.log(options);
            const selectedCDs = Array.from(document.getElementsByClassName("selectCDs"))
            .map(select => {
                return Array.from(select.querySelectorAll("option")).map(option => option.value);
            }); */

            if (update) {
                /* $('.selectCDs').select2().empty().trigger('change');
                $('.selectCDs').select2('destroy').trigger('change'); */
                $('.selectCDs-select').each(function () {
                    const selectedCDs = Array.from($(this).find(":selected")).map(item => item.value);
                    if (!selectedCDs.every(cd => options.findIndex(option => option.id == cd) > -1)) {
                        $(this).select2().empty().val(selectedCDs).trigger('change');
                    }
                    $(this).select2({
                        placeholder: "Ingrese los CD evaluados",
                        multiple: true,
                        closeOnSelect: false,
                        data: [...options]
                    });
                    console.log("selectedCDS: ", selectedCDs);
                    $(this).val(selectedCDs).trigger('change');
                });
            } else {
                $('.selectCDs-select').select2({
                    placeholder: "Ingrese los CD evaluados",
                    multiple: true,
                    closeOnSelect: false,
                    data: [...options]
                });
            }



        }

        function addEvidenceRow(value = undefined) {
            const tr = document.createElement("tr");
            const rows = document.querySelector("#evidencesTable > tbody");
            //TD evidences count
            const tdEvidenceCount = document.createElement("td");
            const inputEvidenceCount = createHTMLElement("input", { type: "text", disabled: true, placeholder: "0", maxLength: 3 });
            inputEvidenceCount.value = rows.children.length + 1;
            inputEvidenceCount.addEventListener("input", (e) => validarNumero(e.target));
            tdEvidenceCount.appendChild(inputEvidenceCount);
            //TD evidence types
            const evidenceTypes = [
                "Audio",
                "Blog",
                "Conjunto de datos",
                "Conjunto de muestras",
                "Diagrama",
                "Diario de aprendizaje",
                "Ensayo",
                "Entrevista",
                "Estudio de caso",
                "Examen",
                "Guion",
                "Infografía",
                "Informe",
                "Juego de rol",
                "Laboratorio",
                "Maqueta",
                "Mapa conceptual",
                "Modelo",
                "Plan de negocios",
                "Portafolio",
                "Poster",
                "Práctica",
                "Presentación oral",
                "Prototipo",
                "Proyecto",
                "Quiz",
                "Reseña",
                "Simulación",
                "Software",
                "Taller",
                "Trabajo",
                "Video"
            ];
            const tdEvidenceTypes = document.createElement("td");
            const selectEvidences = createHTMLElement("select", { required: true });
            const defaultOption = createHTMLElement("option", { disabled: true, selected: true, value: "", innerHTML: "Seleccione" });
            selectEvidences.appendChild(defaultOption);
            for (const type of evidenceTypes) {
                const option = createHTMLElement("option", { value: type, innerHTML: type });
                selectEvidences.appendChild(option);
            }
            if (value && value.tipo) selectEvidences.value = value.tipo;
            tdEvidenceTypes.appendChild(selectEvidences);
            //TD evidence description
            const tdEvidenceDescription = document.createElement("td");
            const textareaEvidenceDescription = createHTMLElement("textarea", { maxLength: 200, rows: 2, className: "count-words", placeholder: "Ingrese la descripción de esta evidencia" });
            if (value && value.descripcion) textareaEvidenceDescription.value = value.descripcion;
            addTextareaEventListener(textareaEvidenceDescription);
            tdEvidenceDescription.appendChild(textareaEvidenceDescription);
            //TD evidence description
            const tdEvidenceCDs = document.createElement("td");
            const textareaEvidenceCDs = createHTMLElement("textarea", { maxLength: 200, rows: 2, className: "count-words selectCDs", placeholder: "Ingrese los CD evaluados" });
            const selectEvidenceCDs = createHTMLElement("select", { maxLength: 200, className: "count-words selectCDs-select" });
            if (value && value.CDEvaluados) textareaEvidenceCDs.value = value.CDEvaluados;
            addTextareaEventListener(textareaEvidenceCDs);
            tdEvidenceCDs.append(selectEvidenceCDs);
            //TD evidences value
            const tdEvidenceValue = document.createElement("td");
            const inputEvidenceValue = createHTMLElement("input", { type: "text", placeholder: "0", maxLength: 3 });
            if (value && value.peso) inputEvidenceValue.value = value.peso;
            const textPercentage = createHTMLElement("span", { textContent: "%" });
            inputEvidenceValue.addEventListener("input", (e) => validarNumero(e.target));
            inputEvidenceValue.addEventListener("change", (e) => checkSumRows(e.target));
            //button remove evidence
            const trChildren = document.querySelector("#evidencesTable > tbody").children;
            if (trChildren.length > 0) {
                const buttonRemoveEvidence = createHTMLElement("button", { className: "evaluable-evidence__remove-button", type: "button" });
                const spanIconTrash = createHTMLElement("span", { className: "fas fa-times" });
                buttonRemoveEvidence.append(spanIconTrash);
                buttonRemoveEvidence.innerHTML = buttonRemoveEvidence.innerHTML + " Eliminar";
                buttonRemoveEvidence.addEventListener("click", () => removeEvidence(tr));
                tdEvidenceValue.append(buttonRemoveEvidence);
            }

            tdEvidenceValue.append(inputEvidenceValue, textPercentage);

            tr.append(tdEvidenceCount, tdEvidenceTypes, tdEvidenceDescription, tdEvidenceCDs, tdEvidenceValue);
            return tr;
        }

        function checkSumRows(input) {
            const valuesInputs = Array.from(document.querySelectorAll("#evidencesTable > tbody > tr > td:nth-child(5) input")).map(input => input.value);
            const sum = valuesInputs.reduce((a, b) => Number(a) + Number(b), 0);
            const inputs = document.querySelectorAll("#evidencesTable > tbody > tr > td:nth-child(5) input");
            const table = document.querySelector("#evidencesTable");
            for (const inputHTML of inputs) {
                inputHTML.title = "";
                inputHTML.classList.remove("marked-value");
            }
            table.classList.remove("error");
            if (sum > 100) {
                input.classList.add("marked-value");
                input.title = "La suma de los pesos evaluativos es mayor a 100";
                table.classList.add("error");
            }

        }

        function removeEvidence(element) {
            element.remove();
            recalculateEvidencesNumbers();
        }

        function recalculateEvidencesNumbers() {
            const rows = document.querySelector("#evidencesTable > tbody").children;
            for (let idx = 0; idx < rows.length; idx++) {
                console.log(rows[idx].firstChild);
                const input = rows[idx].firstChild.querySelector("input");
                input.value = idx + 1;
            }
        }

        function addItemInKnowledgeStructure(value = "") {
            const olStructure = document.getElementsByClassName("knowledge-structure__list")[0];
            if (olStructure) {
                const placeholder = "<Tema>";
                const liNewItem = createItemInKnowledgeStructure(placeholder, "temas", value);
                const actionsItems = createHTMLElement("div", { className: "knowledge-structure__actions" });
                const buttonAddItem = createHTMLElement("button", { type: "button", className: "knowledge-structure__remove-button", innerHTML: "Agregar subtema" });
                buttonAddItem.addEventListener("click", () => addSubitemInItem(liNewItem));
                actionsItems.append(buttonAddItem);
                console.log("olStructure.children: ", olStructure.children)
                if (olStructure.children.length > 0) {
                    const buttonRemoveItem = createHTMLElement("button", { type: "button", className: "knowledge-structure__remove-button", innerHTML: "Eliminar tema" });
                    buttonRemoveItem.addEventListener("click", () => liNewItem.remove());
                    actionsItems.append(buttonRemoveItem);
                }
                liNewItem.appendChild(actionsItems);
                olStructure.appendChild(liNewItem);
            }
        }

        function createItemInKnowledgeStructure(placeholder, name, value = "") {
            const li = document.createElement("li");
            const textareaItem = createHTMLElement("textarea", { name: name, maxLength: 500, rows: 1, className: "count-words", placeholder: placeholder });
            if (value) textareaItem.value = value;
            addTextareaEventListener(textareaItem);
            li.appendChild(textareaItem);
            return li;
        }

        function addSubitemInItem(item, value = "") {
            const existsUl = item.querySelector("ul") != undefined;
            let ulItems = item.querySelector("ul") ?? document.createElement("ul");
            if (ulItems) {
                const placeholder = "<Subtema>";
                const liSubitem = createItemInKnowledgeStructure(placeholder, "subtemas", value);
                const buttonRemoveItem = createHTMLElement("button", { type: "button", className: "knowledge-structure__remove-subitem-button", innerHTML: "Eliminar subtema" });
                buttonRemoveItem.addEventListener("click", () => liSubitem.remove());
                liSubitem.append(buttonRemoveItem);
                ulItems.appendChild(liSubitem);
            }
            if (!existsUl) item.appendChild(ulItems);

        }

        function addTextareaEventListener(text) {
            var observe;
            if (window.attachEvent) {
                observe = function (element, event, handler) {
                    element.attachEvent('on' + event, handler);
                };
            }
            else {
                observe = function (element, event, handler) {
                    element.addEventListener(event, handler, false);
                };
            }

            function resize() {
                text.style.height = 'auto';
                if (text.scrollHeight) text.style.height = (text.scrollHeight + 4) + 'px';
            }
            /* 0-timeout to get the already changed text */
            function delayedResize() {
                window.setTimeout(resize, 0);
            }

            observe(text, 'change', resize);
            observe(text, 'cut', delayedResize);
            observe(text, 'paste', delayedResize);
            observe(text, 'drop', delayedResize);
            observe(text, 'keydown', delayedResize);

            text.focus();
            text.select();
            resize();
        }



        function addRequiredKnowledge(value = "") {
            const requiredKnowledges = document.getElementsByClassName("required-preknowledges__list")[0];
            if (requiredKnowledges) {
                requiredKnowledges.appendChild(createRequiredKnowledge(value));
            }
        }

        function createRequiredKnowledge(value = "") {
            const li = document.createElement("li");
            const textareaItem = createHTMLElement("textarea", { maxLength: 500, rows: 1, className: "count-words", placeholder: "<Presaber (frase que enuncia un resultado de aprendizaje requerido para tomar el curso)>" });
            if (value) textareaItem.value = value;
            addTextareaEventListener(textareaItem);
            const buttonRemoveItem = createHTMLElement("button", { name: "presaber", type: "button", className: "required-preknowledges__remove-button" });
            const spanIconTrash = createHTMLElement("span", { className: "fas fa-times" });
            buttonRemoveItem.append(spanIconTrash);
            buttonRemoveItem.innerHTML = buttonRemoveItem.innerHTML + " Eliminar";
            buttonRemoveItem.addEventListener("click", () => li.remove());
            li.append(textareaItem, buttonRemoveItem);
            return li;
        }

        function addReference(value = "") {
            const references = document.getElementsByClassName("references__list")[0];
            if (references) {
                references.appendChild(createReference(value));
            }
        }

        function createReference(value = "") {
            const li = document.createElement("li");
            const textareaItem = createHTMLElement("textarea", { maxLength: 500, rows: 1, className: "count-words", placeholder: "<Referencia a material de estudio a utilizar en el curso>" });
            if (value) textareaItem.value = value;
            addTextareaEventListener(textareaItem);
            const buttonRemoveItem = createHTMLElement("button", { name: "referencia", type: "button", className: "references__remove-button" });
            const spanIconTrash = createHTMLElement("span", { className: "fas fa-times" });
            buttonRemoveItem.append(spanIconTrash);
            buttonRemoveItem.innerHTML = buttonRemoveItem.innerHTML + " Eliminar";
            buttonRemoveItem.addEventListener("click", () => li.remove());
            li.append(textareaItem, buttonRemoveItem);
            return li;
        }

        function saveData() {
            const formulario = document.getElementById('form');
            console.log("datos: ", formulario.elements);
            const presaber = getDataAsArray(".required-preknowledges__list textarea");
            const referencia = getDataAsArray(".references__list textarea");
            const resultadoAprendizaje = getDataAsArray(".knowledge-results__result textarea");
            const criterios = getCriterias();
            const evidencias = getEvidences();
            const temas = getKnowledgeStructure();
            const datos = {};

            for (const input of formulario.elements) {
                if (input.name) {
                    datos[input.name] = input.value;
                }
            }
            datos["fecha"] = obtenerFechaActual();
            datos["ip"] = document.getElementById("ip").textContent;
            console.log({ ...datos, presaber, referencia, resultadoAprendizaje, criterios, evidencias, temas });
            downloadData({ ...datos, presaber, referencia, resultadoAprendizaje, criterios, evidencias, temas });
        }

        function getDataAsArray(selector) {
            const presaberes = document.querySelectorAll(selector);
            return presaberes ? Array.from(presaberes).map(presaber => presaber.value) : [];
        }
        function getCriterias() {
            const tables = document.getElementsByClassName("knowledges-result-criterias__table");
            const result = Array.from(tables).map(table => {
                const ra = table.querySelector("thead > tr:nth-child(1) > th:nth-child(1)").textContent;
                const value = Array.from(table.querySelectorAll("tbody > tr textarea")).map(text => text.value);
                return { ra, value };
            })
            return result;
        }

        function getKnowledgeStructure() {
            return Array.from(document.querySelectorAll(".knowledge-structure__list > li")).map(item => {
                return {
                    item: item.querySelector("textarea").value,
                    subitems: Array.from(item.querySelectorAll("ul > li textarea")).map(subitem => subitem.value)
                }
            });
        }

        function getEvidences() {
            const evidences = document.querySelectorAll(".evaluable-evidence__table > tbody > tr");
            const result = Array.from(evidences).map(evidence => {
                const cantidad = evidence.querySelector("td:nth-child(1) input").value;
                const tipo = evidence.querySelector("td:nth-child(2) select").value;
                const descripcion = evidence.querySelector("td:nth-child(3) textarea").value;
                console.log("selectCD getEvidence: ", Array.from($(evidence.querySelector("td:nth-child(4) select")).find(":selected")).map(item => item.value));
                const CDEvaluados = Array.from($(evidence.querySelector("td:nth-child(4) select")).find(":selected")).map(item => item.value);
                const peso = evidence.querySelector("td:nth-child(5) input").value;
                return { cantidad, tipo, descripcion, CDEvaluados, peso };
            })
            return result;
        }

        function loadPrograms() {
            const programas = [
                "Centro de Plurilingüismo",
                "Centro de Posgrado y Formación Continua",
                "Centro para la Regionalización de la Educación y las Oportunidades",
                "Ciclo Nivelatorio",
                "Departamento de Estudios Generales e Idiomas",
                "Dirección de Programa de Administración de Empresas",
                "Dirección de Programa de Administración de Empresas Agropecuaria Primer Ciclo",
                "Dirección de Programa de Administración de Empresas Agropecuarias Segundo Ciclo",
                "Dirección de Programa de Administración de Empresas Turísticas y Hoteleras",
                "Dirección de Programa de Administración de la Seguridad y Salud en el Trabajo",
                "Dirección de Programa de Administración Pública",
                "Dirección de Programa de Antropología",
                "Dirección de Programa de Biología",
                "Dirección de Programa de Ciclo Complementario Normal Superior para Señoritas",
                "Dirección de Programa de Cine y Audiovisuales",
                "Dirección de Programa de Contaduría Pública",
                "Dirección de Programa de Derecho",
                "Dirección de Programa de Doctorado en Ciencias de la Educación",
                "Dirección de Programa de Doctorado en Ciencias del Mar",
                "Dirección de Programa de Doctorado en Ciencias Físicas",
                "Dirección de Programa de Doctorado en Educación, Interculturalidad y Territorio",
                "Dirección de Programa de Doctorado en Ingeniería",
                "Dirección de Programa de Doctorado en Medicina Tropical",
                "Dirección de Programa de Economía",
                "Dirección de Programa de Economía Agrícola",
                "Dirección de Programa de Enfermería",
                "Dirección de Programa de Especialización en Acuicultura",
                "Dirección de Programa de Especialización en Alta Gerencia",
                "Dirección de Programa de Especialización en Biología",
                "Dirección de Programa de Especialización en Ciencias Ambientales",
                "Dirección de Programa de Especialización en Ciencias y Tecnología de Alimentos",
                "Dirección de Programa de Especialización en Cooperación Internacional y Gestión Estratégica",
                "Dirección de Programa de Especialización en Derecho Administrativo",
                "Dirección de Programa de Especialización en Derecho Constitucional",
                "Dirección de Programa de Especialización en Derecho Procesal",
                "Dirección de Programa de Especialización en Derechos Humanos y Derecho Internacional Humanitario",
                "Dirección de Programa de Especialización en Desarrollo de Software",
                "Dirección de Programa de Especialización en Dirección y Liderazgo en Organizaciones Educativas",
                "Dirección de Programa de Especialización en Docencia Universitaria",
                "Dirección de Programa de Especialización en Enfermería en Cuidado Crítico",
                "Dirección de Programa de Especialización en Enseñanza de las Ciencias Sociales",
                "Dirección de Programa de Especialización en Estadísticas",
                "Dirección de Programa de Especialización en Finanzas",
                "Dirección de Programa de Especialización en Formulación y Evaluación de Proyectos de Inversión Pública y Privada",
                "Dirección de Programa de Especialización en Formulación y Gestión Integral de Proyectos",
                "Dirección de Programa de Especialización en Gerencia de la Calidad",
                "Dirección de Programa de Especialización en Gerencia de Mercadeo",
                "Dirección de Programa de Especialización en Gerencia de Proyectos de Ingeniería",
                "Dirección de Programa de Especialización en Gestión Ambiental",
                "Dirección de Programa de Especialización en Gestión Estratégica del Talento Humano",
                "Dirección de Programa de Especialización en Gestión para el Desarrollo Territorial",
                "Dirección de Programa de Especialización en Gestión y Control Tributario",
                "Dirección de Programa de Especialización en Gestión y Legislación Ambiental",
                "Dirección de Programa de Especialización en Logística",
                "Dirección de Programa de Especialización en Logística y Transporte Internacional",
                "Dirección de Programa de Especialización en Manejo Sostenible de los Recursos Hídricos en los Sistemas Agrícolas",
                "Dirección de Programa de Especialización en Modelado y Simulación",
                "Dirección de Programa de Especialización en Pedagogía Infantil",
                "Dirección de Programa de Especialización en Saneamiento Básico",
                "Dirección de Programa de Especialización en Seguridad y Salud en el Trabajo",
                "Dirección de Programa de Gestión Cultural y de Industrias Creativas",
                "Dirección de Programa de Gestión y Estudios Culturales",
                "Dirección de Programa de Historia y Patrimonio",
                "Dirección de Programa de Ingeniería Agronómica",
                "Dirección de Programa de Ingeniería Ambiental y Sanitaria",
                "Dirección de Programa de Ingeniería Civil",
                "Dirección de Programa de Ingeniería de Sistemas",
                "Dirección de Programa de Ingeniería Electrónica",
                "Dirección de Programa de Ingeniería Industrial",
                "Dirección de Programa de Ingeniería Pesquera",
                "Dirección de Programa de Intercambio",
                "Dirección de Programa de Licenciatura en Artes",
                "Dirección de Programa de Licenciatura en Artes Plásticas",
                "Dirección de Programa de Licenciatura en Biología y Química",
                "Dirección de Programa de Licenciatura en Ciencias Físico-Matemáticas",
                "Dirección de Programa de Licenciatura en Ciencias Naturales",
                "Dirección de Programa de Licenciatura en Ciencias Naturales y Educación Ambiental",
                "Dirección de Programa de Licenciatura en Ciencias Sociales",
                "Dirección de Programa de Licenciatura en Educación Básica con Énfasis en Ciencias Naturales y Educación Ambiental",
                "Dirección de Programa de Licenciatura en Educación Básica con Énfasis en Ciencias Sociales",
                "Dirección de Programa de Licenciatura en Educación Básica con Énfasis en Humanidades (Lengua Castellana)",
                "Dirección de Programa de Licenciatura en Educación Básica con Énfasis en Idiomas Extranjeros",
                "Dirección de Programa de Licenciatura en Educación Básica con Énfasis en Informática",
                "Dirección de Programa de Licenciatura en Educación Básica con Énfasis en Matemáticas",
                "Dirección de Programa de Licenciatura en Educación Campesina y Rural",
                "Dirección de Programa de Licenciatura en Educación Física",
                "Dirección de Programa de Licenciatura en Educación Infantil",
                "Dirección de Programa de Licenciatura en Educación Preescolar",
                "Dirección de Programa de Licenciatura en Español y Literatura",
                "Dirección de Programa de Licenciatura en Etnoeducación",
                "Dirección de Programa de Licenciatura en Filosofía y Estudios Políticos",
                "Dirección de Programa de Licenciatura en Informática",
                "Dirección de Programa de Licenciatura en Lenguas Extranjeras con Énfasis en Inglés",
                "Dirección de Programa de Licenciatura en Lenguas Modernas",
                "Dirección de Programa de Licenciatura en Literatura y Lengua Castellana",
                "Dirección de Programa de Licenciatura en Matemáticas",
                "Dirección de Programa de Licenciatura en Matemáticas y Física",
                "Dirección de Programa de Licenciatura en Necesidades Educativas Especiales",
                "Dirección de Programa de Licenciatura en Preescolar",
                "Dirección de Programa de Licenciatura en Química",
                "Dirección de Programa de Licenciatura en Tecnología",
                "Dirección de Programa de Maestría Ciencias Ambientales SUE Caribe",
                "Dirección de Programa de Maestría en Acuacultura y Ecología Acuática Tropical",
                "Dirección de Programa de Maestría en Acuicultura",
                "Dirección de Programa de Maestría en Administración",
                "Dirección de Programa de Maestría en Antropología",
                "Dirección de Programa de Maestría en Argumentación Jurídica",
                "Dirección de Programa de Maestría en Ciencias Agrarias",
                "Dirección de Programa de Maestría en Ciencias Físicas",
                "Dirección de Programa de Maestría en Cooperación Internacional",
                "Dirección de Programa de Maestría en Desarrollo Empresarial",
                "Dirección de Programa de Maestría en Desarrollo Territorial Sostenible",
                "Dirección de Programa de Maestría en Ecología y Biodiversidad",
                "Dirección de Programa de Maestría en Educación SUE Caribe",
                "Dirección de Programa de Maestría en Enseñanza de las Ciencias Naturales",
                "Dirección de Programa de Maestría en Enseñanza de las Matemáticas",
                "Dirección de Programa de Maestría en Enseñanza del Lenguaje y la Lengua Castellana",
                "Dirección de Programa de Maestría en Epidemiología",
                "Dirección de Programa de Maestría en Escrituras Audiovisuales",
                "Dirección de Programa de Maestría en Gestión del Territorio Marino Costero",
                "Dirección de Programa de Maestría en Gestión del Turismo Sostenible",
                "Dirección de Programa de Maestría en Ingeniería",
                "Dirección de Programa de Maestría en Logística y Cadena de Suministro",
                "Dirección de Programa de Maestría en Manejo Integrado Costero",
                "Dirección de Programa de Maestría en Pesquerías Tropicales",
                "Dirección de Programa de Maestría en Producción Audiovisual Creativa",
                "Dirección de Programa de Maestría en Promoción y Protección de los Derechos Humanos",
                "Dirección de Programa de Maestría en Psicología Clínica, Jurídica y Forense",
                "Dirección de Programa de Maestría en Psicología de las Organizaciones y del Trabajo",
                "Dirección de Programa de Maestría en Salud Familiar y Comunitaria",
                "Dirección de Programa de Maestría en Salud Mental en Comunidades Diversas",
                "Dirección de Programa de Maestría en Sistemas de Gestión",
                "Dirección de Programa de Medicina",
                "Dirección de Programa de Negocios Internacionales",
                "Dirección de Programa de Odontología",
                "Dirección de Programa de Planificación Territorial: Gestión Regional y Local de Proyectos",
                "Dirección de Programa de Profesional en Deporte",
                "Dirección de Programa de Profesional en Salud Ocupacional (Convenio - Uniquindío)",
                "Dirección de Programa de Programa de Ciencia de la Información y la Documentación (Convenio - Uniquindío)",
                "Dirección de Programa de Programa de Transferencia Temporal Estudiantes Uninariño",
                "Dirección de Programa de Psicología",
                "Dirección de Programa de Psicología Social Comunitaria en Convenio con la (UNAD)",
                "Dirección de Programa de Técnico Laboral Criminalística",
                "Dirección de Programa de Técnico Laboral en Auxiliar de Enfermería",
                "Dirección de Programa de Técnico Laboral en Auxiliar de Farmacia y Droguería",
                "Dirección de Programa de Técnico Laboral en Auxiliar de Higiene y Seguridad Industrial",
                "Dirección de Programa de Técnico Laboral en Auxiliar en Higiene Oral",
                "Dirección de Programa de Técnico Laboral en Auxiliar en Salud Oral",
                "Dirección de Programa de Técnico Laboral en Bienestar y Desarrollo Comunitario",
                "Dirección de Programa de Técnico Laboral en Direccion de Hogares Comunitarios",
                "Dirección de Programa de Técnico Laboral en Diseño Gráfico",
                "Dirección de Programa de Técnico Laboral en Ecoturismo",
                "Dirección de Programa de Técnico Laboral en Electrónica y Electricidad Industrial",
                "Dirección de Programa de Técnico Laboral en Gestión Ambiental",
                "Dirección de Programa de Técnico Laboral en Gestión de Almacenes y Bodegas",
                "Dirección de Programa de Técnico Laboral en Higiene y Seguridad Industrial",
                "Dirección de Programa de Técnico Laboral en Investigación Criminal",
                "Dirección de Programa de Técnico Laboral en Manejo de Plantación de Palma de Aceite",
                "Dirección de Programa de Técnico Laboral en Maquinaria Agrícola",
                "Dirección de Programa de Técnico Laboral en Maquinaria Pesada",
                "Dirección de Programa de Técnico Laboral en Mercadeo y Ventas",
                "Dirección de Programa de Técnico Laboral en Minas de Carbón",
                "Dirección de Programa de Técnico Laboral en Operaciones Básicas Pesqueras",
                "Dirección de Programa de Técnico Laboral en Operario Agrícola Cultivo de Banano",
                "Dirección de Programa de Técnico Laboral en Producción de Medios Escritos",
                "Dirección de Programa de Técnico Laboral en Producción Industrial",
                "Dirección de Programa de Técnico Laboral en Redes de Datos",
                "Dirección de Programa de Técnico Laboral en Refrigeración Industrial",
                "Dirección de Programa de Técnico Laboral en Saneamiento Básico y Agua Potable",
                "Dirección de Programa de Técnico Laboral por Competencia en Atención Integral a la Primera Infancia",
                "Dirección de Programa de Técnico Laboral por Competencia en Auxiliar en Enfermería",
                "Dirección de Programa de Técnico Laboral por Competencias en Ayudante de Electricidad",
                "Dirección de Programa de Técnico Laboral por Competencias en Ayudante de Minería",
                "Dirección de Programa de Técnico Laboral por Competencias en Construcción de Estructura en Concreto con Criterios de Sostenibilidad Ambiental",
                "Dirección de Programa de Técnico Laboral por Competencias en Cosecha y Beneficio de Cafés Especiales",
                "Dirección de Programa de Técnico Laboral por Competencias en Diseño y Animación 3D",
                "Dirección de Programa de Técnico Laboral por Competencias en Diseño y Elaboración de Vestuario para las Artes y la Cultura",
                "Dirección de Programa de Técnico Laboral por Competencias en Electricista Residencial",
                "Dirección de Programa de Técnico Laboral por Competencias en Información Turística y Patrimonial",
                "Dirección de Programa de Técnico Laboral por Competencias en Instalaciones de Redes de Telecomunicaciones",
                "Dirección de Programa de Técnico Laboral por Competencias en Instalador de Sistemas en Refrigeración Comercial e Industrial",
                "Dirección de Programa de Técnico Laboral por Competencias en Música y Sonido",
                "Dirección de Programa de Técnico Laboral por Competencias en Oficial de Construcción",
                "Dirección de Programa de Técnico Laboral por Competencias en Oficinista, Clasificación y Archivo",
                "Dirección de Programa de Técnico Laboral por Competencias en Operador de Equipo Pesado",
                "Dirección de Programa de Técnico Laboral por Competencias en Tránsito, Transporte y Seguridad Vial",
                "Dirección de Programa de Técnico Profesional en Higiene y Seguridad Industrial",
                "Dirección de Programa de Técnico Profesional en Prevención de Riesgos Laborales",
                "Dirección de Programa de Técnico Profesional en Procesos de Gestión Pública Territorial",
                "Dirección de Programa de Tecnología en Acuicultura",
                "Dirección de Programa de Tecnología en Administración de Empresas (Convenio UNAD)",
                "Dirección de Programa de Tecnología en Administración en Servicios de Salud Convenio(Unicartagena)",
                "Dirección de Programa de Tecnología en Administración Hotelera y Turística",
                "Dirección de Programa de Tecnología en Administración Pública",
                "Dirección de Programa de Tecnología en Análisis y Programación de Computadores",
                "Dirección de Programa de Tecnología en Artes Musicales",
                "Dirección de Programa de Tecnología en Atención Integral a la Primera Infancia",
                "Dirección de Programa de Tecnología en Educación Física, Recreación y Deporte",
                "Dirección de Programa de Tecnología en Gestión Agropecuaria",
                "Dirección de Programa de Tecnología en Gestión Contable",
                "Dirección de Programa de Tecnología en Gestión de la Seguridad y Salud en el Trabajo",
                "Dirección de Programa de Tecnología en Gestión Hotelera y Turística",
                "Dirección de Programa de Tecnología en Gestión Pecuaria",
                "Dirección de Programa de Tecnología en Gestión Pública Territorial",
                "Dirección de Programa de Tecnología en Regencia de Farmacia",
                "Dirección de Programa de Tecnología en Salud Ocupacional",
                "Eje de Investigación",
                "Estudiantes de Grado",
                "Facultad de Ciencias Agropecuarias",
                "Facultad de Ciencias Básicas",
                "Facultad de Ciencias de la Salud",
                "Facultad de Ciencias Empresariales y Económicas",
                "Facultad de Educación",
                "Facultad de Humanidades",
                "Facultad de Ingeniería",
                "Facultad para Plan de Contingencia Uninariño",
                "Prácticas Profesionales",
                "Requisito de Grado"
            ];
            const selectUnidad = document.getElementById("unidad");
            for (const programa of programas) {
                const option = createHTMLElement("option", { value: programa, textContent: programa });
                selectUnidad.appendChild(option);
            }
        }

        function loadEducationalLevel() {
            const educationalLevels = [
                "Educación Continuada",
                "Diplomado",
                "Técnico Laboral por Competencias",
                "Técnico Profesional",
                "Tecnológico",
                "Profesional",
                "Especialización",
                "Maestría",
                "Doctorado"
            ];
            const selectLevel = document.getElementById("nivel");
            for (const level of educationalLevels) {
                const option = createHTMLElement("option", { value: level, textContent: level });
                selectLevel.appendChild(option);
            }
        }