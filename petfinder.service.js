function PetFinderService($http, $q) {
    const service = this;
    
    service.key = 'rEKWKvPrW7HpooXYxbjymSfIAOyKcwvvhixHIIWNAYlZeLLzmv'; // Fill in here
    service._secret = 'OlpuSV27PqFDXswHBLBMPCHuTPh6DfxauvnwNSO5'; // Fill in here
    
    service.token = '';
    
    /**
     * Handle authentication & whatnot
     */
    service.doAuth = () => {
        return $q(function(resolve, reject) {
            
            // Return token if we already have one
            if ( service.token && service.token.length ) {
                resolve(service.token);
            }
            
            $http({
                url: 'https://api.petfinder.com/v2/oauth2/token',
                data: {
                    grant_type: 'client_credentials',
                    client_id: service.key,
                    client_secret: service._secret
                },
                method: 'POST'
            })
            .then( (response) =>{
                service.token = response.data.access_token;
                resolve(service.token);
            });
        })
        
    };
    
    /**
     * Calls petfinder API to get types
     * organizes the data using a foreach loop
     * then resolves the promise with an array of objects
     */
    service.getTypes = () => {
        return $q(function(resolve, reject) {
            service.doAuth()
            .then( (token) => {
                $http({
                    url: 'https://api.petfinder.com/v2/types/',
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then( (response) => {
                    let types = [];

                    // Go through each item and organize
                    // the data into usable array
                    response.data.types.forEach( function(type) {
                        // See API docs for how this is organized
                        types.push({
                            name: type.name,
                            value: type._links.self.href.split('/v2/types/')[1]
                        })
                    });

                    console.log(types);
                    resolve(types);
                })
                .catch( (err) => {
                    console.log(err);
                    reject(error);
                })
                
            });
        })
    }

    service.getTypes();
    
    /**
     * Calls the petfinder service to fill return animal dta
     * 
     * @returns Promise that resolves with an array of animals
     */
    service.getData = (filter) => {
        let url = 'https://api.petfinder.com/v2/animals';
        
        // If a filter is supplied, add to URL to query by that type
        if ( filter ) {
            url += `?type=${filter}`;
        }
        
        return $q(function(resolve, reject) {
            service.doAuth()
            .then( (token) => {
                $http({
                    url: url,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                })
                .then( (response) => {
                    resolve(response.data.animals);
                })
                .catch( (err) => {
                    console.log(err);
                    reject(error);
                })
            });
        });
    }
    
}
angular
.module('MyApp')
.service('PetFinder', ['$http', '$q', PetFinderService])

// Using $http and $q as dependencies of our service, PetFinder

