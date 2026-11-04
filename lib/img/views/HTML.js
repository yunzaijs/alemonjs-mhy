import _lvy_styles_842cb9a9f8394bef10213b49_default from "../../_virtual/_lvy-styles_842cb9a9f8394bef10213b49.js";
import _lvy_asset_47_default from "../../_virtual/_lvy-asset_47.js";
import React from "react";
import classNames from "classnames";

// src/img/views/HTML.tsx
const HTML = (props) => {
	const { children, className, ...reSet } = props;
	return /* @__PURE__ */ React.createElement("html", { className: "p-0 m-0" }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("link", {
		type: "text/css",
		rel: "stylesheet",
		href: _lvy_styles_842cb9a9f8394bef10213b49_default
	}), /* @__PURE__ */ React.createElement("meta", {
		httpEquiv: "content-type",
		content: "text/html;charset=utf-8"
	}), /* @__PURE__ */ React.createElement("style", { dangerouslySetInnerHTML: { __html: `
              @font-face {
                font-family: 'tttgbnumber';
                src: url('${_lvy_asset_47_default}'); 
                font-weight: normal; 
                font-style: normal; 
              }
              body { 
                font-family: 'tttgbnumber', 
                system-ui, sans-serif; 
              }
            ` } })), /* @__PURE__ */ React.createElement("body", {
		className: classNames("p-0 m-0 w-full text-center", className),
		...reSet
	}, children));
};

export { HTML as default };