///<reference path="../libs/away3d.next.d.ts" />
var examples;
(function (examples) {
    var ColorMaterial = away.materials.ColorMaterial;
    var TextureMaterial = away.materials.TextureMaterial;

    var AWDSuzanne = (function () {
        function AWDSuzanne() {
            var _this = this;
            this._lookAtPosition = new away.geom.Vector3D();
            this._cameraIncrement = 0;
            this._mouseOverMaterial = new ColorMaterial(0xFF0000);
            this.initView();
            this.loadAssets();
            this.initLights();

            window.onresize = function () {
                return _this.resize();
            };
            this.resize();
        }
        /**
        *
        */
        AWDSuzanne.prototype.initView = function () {
            this._view = new away.containers.View(new away.render.DefaultRenderer());
            this._view.camera.projection.far = 6000;
            this._view.forceMouseMove = true;
        };

        /**
        *
        */
        AWDSuzanne.prototype.loadAssets = function () {
            var _this = this;
            this._timer = new away.utils.RequestAnimationFrame(this.render, this);
            this._timer.start();

            away.library.AssetLibrary.enableParser(away.parsers.AWDParser);

            this._token = away.library.AssetLibrary.load(new away.net.URLRequest('assets/suzanne.awd'));
            this._token.addEventListener(away.events.LoaderEvent.RESOURCE_COMPLETE, function (event) {
                return _this.onResourceComplete(event);
            });
        };

        /**
        *
        */
        AWDSuzanne.prototype.initLights = function () {
            this._light = new away.lights.DirectionalLight();
            this._light.color = 0x683019;
            this._light.direction = new away.geom.Vector3D(1, 0, 0);
            this._light.ambient = 0.1;
            this._light.ambientColor = 0x85b2cd;
            this._light.diffuse = 2.8;
            this._light.specular = 1.8;
            this._view.scene.addChild(this._light);
            this._lightPicker = new away.materials.StaticLightPicker([this._light]);
        };

        /**
        *
        */
        AWDSuzanne.prototype.resize = function () {
            this._view.y = 0;
            this._view.x = 0;
            this._view.width = window.innerWidth;
            this._view.height = window.innerHeight;
        };

        /**
        *
        * @param dt
        */
        AWDSuzanne.prototype.render = function (dt) {
            if (this._view.camera) {
                this._view.camera.lookAt(this._lookAtPosition);
                this._cameraIncrement += 0.01;
                this._view.camera.x = Math.cos(this._cameraIncrement) * 1400;
                this._view.camera.z = Math.sin(this._cameraIncrement) * 1400;

                this._light.x = Math.cos(this._cameraIncrement) * 1400;
                this._light.y = Math.sin(this._cameraIncrement) * 1400;
            }

            this._view.render();
        };

        /**
        *
        * @param e
        */
        AWDSuzanne.prototype.onResourceComplete = function (e) {
            var _this = this;
            var loader = e.target;
            var numAssets = loader.baseDependency.assets.length;

            for (var i = 0; i < numAssets; ++i) {
                var asset = loader.baseDependency.assets[i];

                switch (asset.assetType) {
                    case away.library.AssetType.MESH:
                        var mesh = asset;

                        this._suzane = mesh;
                        this._suzane.material.lightPicker = this._lightPicker;
                        this._suzane.y = -100;
                        this._mouseOutMaterial = this._suzane.material;

                        for (var c = 0; c < 80; c++) {
                            var clone = mesh.clone();
                            var scale = this.getRandom(50, 200);
                            clone.x = this.getRandom(-2000, 2000);
                            clone.y = this.getRandom(-2000, 2000);
                            clone.z = this.getRandom(-2000, 2000);
                            clone.transform.scale = new away.geom.Vector3D(scale, scale, scale);
                            clone.rotationY = this.getRandom(0, 360);
                            clone.addEventListener(away.events.MouseEvent.MOUSE_OVER, function (event) {
                                return _this.onMouseOver(event);
                            });
                            clone.addEventListener(away.events.MouseEvent.MOUSE_OUT, function (event) {
                                return _this.onMouseOut(event);
                            });
                            this._view.scene.addChild(clone);
                        }

                        mesh.transform.scale = new away.geom.Vector3D(500, 500, 500);
                        mesh.pickingCollider = new away.pick.JSPickingCollider();
                        mesh.addEventListener(away.events.MouseEvent.MOUSE_OVER, function (event) {
                            return _this.onMouseOver(event);
                        });
                        mesh.addEventListener(away.events.MouseEvent.MOUSE_OUT, function (event) {
                            return _this.onMouseOut(event);
                        });
                        this._view.scene.addChild(mesh);

                        break;

                    case away.library.AssetType.GEOMETRY:
                        break;

                    case away.library.AssetType.MATERIAL:
                        break;
                }
            }
        };

        AWDSuzanne.prototype.onMouseOver = function (event) {
            event.object.material = this._mouseOverMaterial;

            console.log("mouseover");
        };

        AWDSuzanne.prototype.onMouseOut = function (event) {
            event.object.material = this._mouseOutMaterial;

            console.log("mouseout");
        };

        /**
        *
        * @param min
        * @param max
        * @returns {number}
        */
        AWDSuzanne.prototype.getRandom = function (min, max) {
            return Math.random() * (max - min) + min;
        };
        return AWDSuzanne;
    })();
    examples.AWDSuzanne = AWDSuzanne;
})(examples || (examples = {}));

window.onload = function () {
    new examples.AWDSuzanne();
};
//# sourceMappingURL=AWDSuzanne.js.map
