const Scene = require('Scene');
const Diagnostics = require('Diagnostics');
const Reactive = require('Reactive');
const Time = require('Time');

function main(assets)
{
  const ArrayGroup = assets[0];
  const ObjectCheck = assets[1];

  const timeInMilliseconds = 1000;
  
    function Update(){

      var distances = ArrayGroup.map(target => Reactive.distance(ObjectCheck.worldTransform.position, target.worldTransform.position));
      var min = distances.reduce((acc, dist) => Reactive.min(acc, dist));
      var indexes = distances.map((cur, ind) => Reactive.eq(cur, min).ifThenElse(ind, -1));

      var closestIndex = indexes.reduce((acc, cur) => Reactive.max(acc, cur));

      Diagnostics.log(ArrayGroup[closestIndex.pinLastValue()].name);
      Diagnostics.watch('Closest index:', closestIndex); 
    }

    Time.setInterval(Update, timeInMilliseconds);
}

const loadAssets = Promise.all(
  [
    Scene.root.findByPath('**/ArrayGroup/*'),
    Scene.root.findFirst('ObjectCheck'),
  ]

).then(main);

loadAssets.catch( (error) =>
  {
    Diagnostics.log("Found errors in script Array");
    Diagnostics.log(error.message);
  }
);