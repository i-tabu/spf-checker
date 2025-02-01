async function checkSPF() {
    const domain = document.getElementById("domainInput").value.trim();
    const resultDiv = document.getElementById("result");
    
    if (!domain) {
        resultDiv.className = "alert alert-warning";
        resultDiv.textContent = "Please enter a domain.";
        resultDiv.classList.remove("d-none");
        return;
    }

    // Using Cloudflare DNS API to fetch TXT records
    const apiUrl = `https://cloudflare-dns.com/dns-query?name=${domain}&type=TXT`;

    try {
        const response = await fetch(apiUrl, {
            headers: { "Accept": "application/dns-json" }
        });

        if (!response.ok) throw new Error("Failed to fetch DNS records");

        const data = await response.json();
        const txtRecords = data?.Answer?.map(record => record.data) || [];

        // Filter for SPF records
        const spfRecords = txtRecords.filter(record => record.startsWith('"v=spf1'));

        if (spfRecords.length > 0) {
            resultDiv.className = "alert alert-success";
            resultDiv.textContent = `Valid SPF record found: ${spfRecords.join(", ")}`;
        } else {
            resultDiv.className = "alert alert-danger";
            resultDiv.textContent = "No valid SPF record found!";
        }

        resultDiv.classList.remove("d-none");

    } catch (error) {
        resultDiv.className = "alert alert-danger";
        resultDiv.textContent = `Error fetching SPF record: ${error.message}`;
        resultDiv.classList.remove("d-none");
    }
}

