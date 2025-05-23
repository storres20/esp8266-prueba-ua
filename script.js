const apiUrl = "https://x8ki-letl-twmt.n7.xano.io/api:LxOGgPkm/sensor_reading";

async function fetchSensorData() {
    try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!Array.isArray(data)) {
            console.error("La respuesta de la API no es un array.");
            return;
        }

        // === Ordenar por fecha ascendente (de más antiguo a más reciente) ===
        data.sort((a, b) => a.created_at - b.created_at);

        // === Seleccionar el último registro ===
        const latest = data.at(-1);

        const tempActual = latest.temperatura ?? "-";
        const humedadActual = latest.humedad ?? "-";
        const anguloActual = latest.angulo ?? "-";
        const pesoActual = latest.peso ?? "-";
        const distanciaActual = latest.distancia ?? "-";

        const fechaActual = new Date(Number(latest.created_at)).toLocaleString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Lima"
        });

        // === Actualizar tarjeta ===
        document.getElementById("currentTemp").textContent = `${tempActual} °C`;
        document.getElementById("currentHumidity").textContent = `${humedadActual} %`;
        document.getElementById("currentAngle").textContent = `${anguloActual} °`;
        document.getElementById("currentWeight").textContent = `${pesoActual} g`;
        document.getElementById("currentDistance").textContent = `${distanciaActual} cm`;
        document.getElementById("currentDate").textContent = `Última actualización: ${fechaActual}`;

        // === Limpiar y llenar tabla ===
        const table = document.getElementById("dataTable");
        table.innerHTML = "";

        data.forEach((entry, index) => {
            const fecha = new Date(Number(entry.created_at)).toLocaleString("es-PE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
                timeZone: "America/Lima"
            });

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${fecha}</td>
                <td>${entry.temperatura ?? "-"}</td>
                <td>${entry.humedad ?? "-"}</td>
                <td>${entry.angulo ?? "-"}</td>
                <td>${entry.peso ?? "-"}</td>
                <td>${entry.distancia ?? "-"}</td>
            `;
            table.appendChild(row);
        });

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        document.getElementById("currentTemp").textContent = "Error";
        document.getElementById("currentHumidity").textContent = "-";
        document.getElementById("currentAngle").textContent = "-";
        document.getElementById("currentWeight").textContent = "-";
        document.getElementById("currentDistance").textContent = "-";
        document.getElementById("currentDate").textContent = "—";
    }
}

// Ejecutar al cargar y actualizar cada 5 segundos
fetchSensorData();
setInterval(fetchSensorData, 5000);
