function Finder(PetFinder) { // Importing PetFinder service
    // Use ctrl to affect the $ctrl values in the view
    const ctrl = this;

    /**
     * Loads in list of animals
     * 
     * @see Service PetFinder
     */
    ctrl.getAnimals = () => {
      ctrl.loading = true;

      PetFinder.getData(ctrl.filter ? ctrl.filter.value : '')
      .then( (animals) => {
        ctrl.animals = animals;
        ctrl.loading = false;
      })
    }

    /**
     * Call types endpoint to populate select box.
     * Lets you filter by type
     * 
     * @see Service PetFinder
     */
    ctrl.getTypes = () => {
      PetFinder.getTypes()
      .then( (types) => {
        ctrl.types = types;
      })
      .catch( (err) => {
        console.error(err);
      })
    }

    /**
     * When the app loads, call these functions to load in the data
     */
    ctrl.$onInit = () => {
      ctrl.getAnimals();
      ctrl.getTypes();
    }
  }
  
  angular.module('MyApp').component('finder', {
    template: `
        <h2> Pet Finder </h2>

        <select 
          ng-model="$ctrl.filter"
          ng-options="type.name for type in $ctrl.types"
          ng-change="$ctrl.getAnimals()"
        >
         <option value="">-- Choose type --</option>
        </select>

        <div ng-if="$ctrl.loading">
          Loading...
        </div>

        <ul ng-if="!$ctrl.loading">
          <li ng-repeat="pet in $ctrl.animals track by $index"> {{ $index + 1 }}. <strong>Name:</strong>{{pet.name}} <br/> <strong>Breed:</strong>{{pet.breeds.primary}}</li>
        </ul>

    `, // or use templateUrl
    controller: Finder,
});