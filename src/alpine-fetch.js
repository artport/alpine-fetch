['get', 'post', 'patch', 'put', 'delete'].forEach(verb => {
    Alpine.magic(verb, () => {
        return async (url, data = {}, format = 'json', options = {}) => {
            let configuration = {
                headers : {
                    'Content-Type'     : 'application/json',
                    'X-CSRF-TOKEN'     : document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    'X-Requested-With' : 'XMLHttpRequest',
                }
            };

            configuration = verb === 'get' ? configuration : Object.assign(configuration, {
                body        : JSON.stringify(Object.assign(data, { _method : verb })),
                credentials : 'same-origin',
                method      : 'post',
            });

            let response = await fetch(url, Object.assign(configuration, options));

            if (! response.ok) return response;

            switch (format) {
                case 'blob' : return await response.blob();
                case 'json' : return await response.json();
                case 'text' : return await response.text();
                default     : return response;
            }
        }
    })
});
