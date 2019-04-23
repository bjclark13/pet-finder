function Finder(PetFinder, $rootScope) {
    const ctrl = this;

    ctrl.getAnimals = () => {
      PetFinder.getData()
      .then( (animals) => {
        ctrl.animals = animals;
      })
    }

    ctrl.value = 'this is the value';

    ctrl.$onInit = () => {
      ctrl.getAnimals();
    }
  }
  
  angular.module('MyApp').component('finder', {
    template: `
        <h2> Pet Finder </h2>
        <input ng-model="value" />
        <ul>
          <li ng-repeat="pet in $ctrl.animals track by $index"> {{ $index + 1 }}. <strong>Name:</strong>{{pet.name}} <br/> <strong>Breed:</strong>{{pet.breeds.primary}}</li>
        </ul>
        {{$ctrl.value}}

    `, // or use templateUrl
    controller: Finder,
});