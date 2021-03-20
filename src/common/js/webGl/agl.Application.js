require("../helpers/removeFromArray.js");
require("../helpers/arraySet.js");
require("../helpers/property.js");
require("../helpers/map.js");
require("../helpers/emptyFunction.js");
require("../helpers/createPrototypeClass.js");
require("../helpers/BasePrototypeClass.js");
require("../helpers/isEmpty.js");
require("../helpers/deepFreeze.js");

require("./NameSpace.js");

require("./data/agl.BlendMode.js");

require("./data/props/agl.BaseProps.js");
require("./data/props/agl.BasePositioningProps.js");
require("./data/props/agl.ColorProps.js");
require("./data/props/agl.ItemProps.js");
require("./data/props/agl.TextureCrop.js");
require("./data/props/agl.TextureProps.js");

require("./data/texture/agl.TextureInfo.js");
require("./data/texture/agl.Texture.js");
require("./data/texture/agl.Framebuffer.js");

require("./utils/agl.Context.js");
require("./utils/agl.Buffer.js");
require("./utils/agl.Utils.js");
require("./utils/agl.FPS.js");

require("./geom/agl.Matrix3.js");
require("./geom/agl.Point.js");
require("./geom/agl.Rect.js");

require("./display/agl.BaseItem.js");
require("./display/agl.Item.js");
require("./display/agl.BaseDrawable.js");
require("./display/agl.Light.js");
require("./display/agl.AnimatedImage.js");
require("./display/agl.Container.js");
require("./display/agl.StageContainer.js");
require("./display/agl.Image.js");
require("./display/agl.SmoothLight.js");

require("./renderer/agl.BaseRenderer.js");
require("./renderer/agl.BaseBatchRenderer.js");
require("./renderer/agl.FilterRenderer.js");
require("./renderer/agl.LightRenderer.js");
require("./renderer/agl.SimpleRenderer.js");
require("./renderer/agl.Stage2D.js");

require("./filters/agl.BaseFilter.js");

require("./filters/agl.DisplacementFilter.js");
require("./filters/agl.PixelateFilter.js");

require("./filters/agl.EdgeDetectFilter.js");
require("./filters/agl.SharpenFilter.js");

require("./filters/agl.GrayscaleFilter.js");
require("./filters/agl.SepiaFilter.js");
require("./filters/agl.InvertFilter.js");
require("./filters/agl.TintFilter.js");
require("./filters/agl.ColorLimitFilter.js");
require("./filters/agl.VignetteFilter.js");
require("./filters/agl.RainbowFilter.js");
require("./filters/agl.BrightnessContrastFilter.js");
require("./filters/agl.GammaFilter.js");

require("./filters/agl.BlurFilter.js");
require("./filters/agl.GlowFilter.js");
