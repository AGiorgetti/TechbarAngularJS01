angular.module('myControls', [])
.directive('selectDropdown', ['$parse', '$compile', '$timeout',
 function ($parse, $compile, $timeout) {
     /// <summary>
     /// dipende da twitter bootstrap.
     ///                 
     /// direttiva per la creazione di un menu dropdown accetta una lista di elementi crata con queste caratteristiche
     /// {            	
     ///     text: 'A',            	                
     ///     value: 'A',    
     ///     description: 'long description for A',                
     ///     imageSrc: ''                                
     /// }         
     /// il comando deve essere dichiarato:
     /// <div class="btn-group">
     ///     <button type="button" class="btn" data-image-dropdown="list">...</button>
     /// </div>
     /// </summary>
     /// <param name="$parse"></param>
     /// <param name="$compile"></param>
     /// <param name="$timeout"></param>
     /// <returns type=""></returns>

     var buildTemplate = function (items, ul) {
         if (!ul)
             ul = [];
         ul.push('<ul class="dropdown-menu" role="menu" aria-labelledby="drop1">');
         angular.forEach(items, function (item, index) {
             if (item.divider) {
                 ul.push('<li class="divider"></li>');
                 return;
             };
             var li = '<li><a tabindex="-1" data-ng-click="selectItem(' + index + ')" >' +
                       (buildItemTemplate(item) || '') + '</a></li>';
             ul.push(li);
         });
         ul.push('</ul>');
         return ul;
     };

     var buildItemTemplate = function (itm) {
         return '<img data-ng-src="' + itm.imageSrc + '"/><label>' + itm.text + '</label><small>' + itm.description + '</small>';
     };

     return {
         restrict: 'EA',
         require: 'ngModel',
         scope: {
             model: '=ngModel',
             list: '='
         },
         link: function postLink(scope, iElement, iAttrs) {
             var items = scope.list;

             scope.selectItem = function (idx) {
                 if (idx > -1)
                     scope.model = scope.list[idx];
             };

             var htmlStart = '<div class="dropdown" data-ng-model="model">' +
                            '<button type="button" class="btn" data-toggle="dropdown">' +
                            buildItemTemplate({ imageSrc: '{{model.imageSrc}}', text: '{{model.text}}', description: '{{model.description}}' }) +
                            '</button>';
             var htmlEnd = '</div>';

             // Defer after any ngRepeat rendering
             $timeout(function () {
                 var dropdown = angular.element(
                                htmlStart +
                                buildTemplate(items).join('') + // iterate and concatenate all the elements of the array
                                htmlEnd
                            );

                 // Compile 
                 var compiled = $compile(dropdown)(scope);
                 iElement.replaceWith(compiled);
             });
         }
     };
 } ]);