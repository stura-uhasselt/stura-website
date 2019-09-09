function changeLang(lang) {
    fetch('https://api.dev.sturauhasselt.be/language', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            language: lang,
        }),
    }).then(res => res.json()).then((res) => {
        location.reload();   
    });
}
