app.get('/api/get', (req,res) => {
    var data = {
        name: 'Axel',
        surname: 'De Sutter',
        active: 'No'
    }

    res.send(data);
})