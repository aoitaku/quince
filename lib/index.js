function normalizeBoxSpacing(h) {
	switch (h.length) {
		case 4: return [
			h[0],
			h[1],
			h[2],
			h[3]
		];
		case 3: return [
			h[0],
			h[1],
			h[2],
			h[1]
		];
		case 2: return [
			h[0],
			h[1],
			h[0],
			h[1]
		];
		case 1: return [
			h[0],
			h[0],
			h[0],
			h[0]
		];
	}
}
function createStyle(h) {
	let W = {
		position: "relative",
		top: void 0,
		left: void 0,
		bottom: void 0,
		right: void 0,
		width: void 0,
		height: void 0,
		layout: "flow",
		justifyContent: "left",
		alignItems: "top",
		breakAfter: !1,
		visible: !0,
		horizontalItemArrangement: "real",
		verticalItemArrangement: "real",
		margin: [
			0,
			0,
			0,
			0
		],
		padding: [
			0,
			0,
			0,
			0
		]
	};
	if (!h) return W;
	let { margin: q, padding: J, ...Y } = h;
	return W = {
		...W,
		...Y
	}, q && (W = setMargin(W, q)), J && (W = setPadding(W, J)), W;
}
function setMargin(W, G) {
	return {
		...W,
		margin: normalizeBoxSpacing(G)
	};
}
function setPadding(W, G) {
	return {
		...W,
		padding: normalizeBoxSpacing(G)
	};
}
function getMarginTop$1(h) {
	return h.margin[0];
}
function getMarginRight$1(h) {
	return h.margin[1];
}
function getMarginBottom$1(h) {
	return h.margin[2];
}
function getMarginLeft$1(h) {
	return h.margin[3];
}
function getPaddingTop$1(h) {
	return h.padding[0];
}
function getPaddingRight$1(h) {
	return h.padding[1];
}
function getPaddingBottom$1(h) {
	return h.padding[2];
}
function getPaddingLeft$1(h) {
	return h.padding[3];
}
function createComponent(h, G) {
	return {
		id: h,
		rawX: void 0,
		rawY: void 0,
		rawWidth: void 0,
		rawHeight: void 0,
		contentWidth: void 0,
		contentHeight: void 0,
		style: createStyle(G)
	};
}
function getX(h) {
	return h.rawX;
}
function getY(h) {
	return h.rawY;
}
function getPosition(h) {
	return h.style.position;
}
function getTop(h) {
	return h.style.top || 0;
}
function getLeft(h) {
	return h.style.left || 0;
}
function getBottom(h) {
	return h.style.bottom || 0;
}
function getRight(h) {
	return h.style.right || 0;
}
function getLayout(h) {
	return h.style.layout;
}
function getJustifyContent(h) {
	return h.style.justifyContent;
}
function getAlignItems(h) {
	return h.style.alignItems;
}
function getBreakAfter(h) {
	return h.style.breakAfter;
}
function getVisible(h) {
	return h.style.visible;
}
function getHorizontalItemArrangement(h) {
	return h.style.horizontalItemArrangement;
}
function getVerticalItemArrangement(h) {
	return h.style.verticalItemArrangement;
}
function getPaddingTop(h) {
	return getPaddingTop$1(h.style);
}
function getPaddingRight(h) {
	return getPaddingRight$1(h.style);
}
function getPaddingBottom(h) {
	return getPaddingBottom$1(h.style);
}
function getPaddingLeft(h) {
	return getPaddingLeft$1(h.style);
}
function getWidth(h) {
	return testIfComponent(h) ? h.rawWidth || h.contentWidth || 0 : h.width;
}
function getHeight(h) {
	return testIfComponent(h) ? h.rawHeight || h.contentHeight || 0 : h.height;
}
function getLayoutWidth(h) {
	return getPosition(h) === "absolute" ? 0 : getWidth(h) + getMarginLeft(h) + getMarginRight(h);
}
function getLayoutHeight(h) {
	return getPosition(h) === "absolute" ? 0 : getHeight(h) + getMarginTop(h) + getMarginBottom(h);
}
function getMarginTop(h) {
	return getPosition(h) === "absolute" ? 0 : getMarginTop$1(h.style);
}
function getMarginRight(h) {
	return getPosition(h) === "absolute" ? 0 : getMarginRight$1(h.style);
}
function getMarginBottom(h) {
	return getPosition(h) === "absolute" ? 0 : getMarginBottom$1(h.style);
}
function getMarginLeft(h) {
	return getPosition(h) === "absolute" ? 0 : getMarginLeft$1(h.style);
}
function getHorizontalMargin(h) {
	return getMarginLeft(h) + getMarginRight(h);
}
function getOffsetLeft(h, W) {
	return Math.max(getPaddingLeft(W), getMarginLeft(h));
}
function getOffsetRight(h, W) {
	return Math.max(getPaddingRight(W), getMarginRight(h));
}
function getHorizontalOffset(h, W) {
	return getOffsetLeft(h, W) + getOffsetRight(h, W);
}
function getVerticalMargin(h) {
	return getMarginTop(h) + getMarginBottom(h);
}
function getOffsetTop(h, W) {
	return Math.max(getPaddingTop(W), getMarginTop(h));
}
function getOffsetBottom(h, W) {
	return Math.max(getPaddingBottom(W), getMarginBottom(h));
}
function getVerticalOffset(h, W) {
	return getOffsetTop(h, W) + getOffsetBottom(h, W);
}
function getInnerWidth(h, W) {
	return testIfComponent(W) ? getWidth(W) - getHorizontalOffset(h, W) : getWidth(W) - getHorizontalMargin(h);
}
function getInnerHeight(h, W) {
	return testIfComponent(W) ? getHeight(W) - getVerticalOffset(h, W) : getHeight(W) - getVerticalMargin(h);
}
function testIfComponent(h) {
	return "id" in h;
}
function move(h, W, G, K) {
	return {
		x: calculateMoveX(h, W, K),
		y: calculateMoveY(h, G, K)
	};
}
function resize(h, W) {
	return {
		width: calculateResizeWidth(h, W),
		height: calculateResizeHeight(h, W)
	};
}
function applyMove(h, W) {
	h.rawX = W.x, h.rawY = W.y;
}
function applyResize(h, W) {
	h.rawWidth = W.width, h.rawHeight = W.height;
}
function calculateResizeWidth(h, W) {
	return h.style.width === "full" ? getInnerWidth(h, W) : !testIfComponent(W) || getHorizontalItemArrangement(W) === "real" ? h.style.width || 0 : getHorizontalItemArrangement(W) === "ratio" ? (h.style.width || 0) * getWidth(W) : 0;
}
function calculateResizeHeight(h, W) {
	return h.style.height === "full" ? getInnerHeight(h, W) : !testIfComponent(W) || getVerticalItemArrangement(W) === "real" ? h.style.height || 0 : getVerticalItemArrangement(W) === "ratio" ? (h.style.height || 0) * getHeight(W) : 0;
}
function calculateMoveX(h, W, G) {
	return getPosition(h) === "absolute" ? getLeft(h) && typeof getLeft(h) == "number" ? Number.isInteger(getLeft(h)) ? W + getLeft(h) : W + (getWidth(G) - getWidth(h)) * getLeft(h) : getRight(h) && typeof getRight(h) == "number" ? Number.isInteger(getRight(h)) ? W + getWidth(G) - getWidth(h) - getRight(h) : W + (getWidth(G) - getWidth(h)) * (1 - getRight(h)) : W : getLeft(h) && typeof getLeft(h) == "number" ? Number.isInteger(getLeft(h)) ? W + getLeft(h) : W + getWidth(h) * getLeft(h) : getRight(h) && typeof getRight(h) == "number" ? Number.isInteger(getRight(h)) ? W - getRight(h) : W - getWidth(h) * getRight(h) : W;
}
function calculateMoveY(h, W, G) {
	return getPosition(h) === "absolute" ? getTop(h) && typeof getTop(h) == "number" ? Number.isInteger(getTop(h)) ? W + getTop(h) : W + (getHeight(G) - getHeight(h)) * getTop(h) : getBottom(h) && typeof getBottom(h) == "number" ? Number.isInteger(getBottom(h)) ? W + getHeight(G) - getHeight(h) - getBottom(h) : W + (getHeight(G) - getHeight(h)) * (1 - getBottom(h)) : W : getTop(h) && typeof getTop(h) == "number" ? Number.isInteger(getTop(h)) ? W + getTop(h) : W + getHeight(h) * getTop(h) : getBottom(h) && typeof getBottom(h) == "number" ? Number.isInteger(getBottom(h)) ? W - getBottom(h) : W - getHeight(h) * getBottom(h) : W;
}
function createContainer(h = []) {
	return { components: h };
}
function addComponent(h, W) {
	h.components.push(W);
}
function findComponent(h, W) {
	return h.components.find((h) => h.id === W);
}
var maxBy = (h, W) => {
	if (h.length !== 0) return h.reduce((h, G) => W(G) > W(h) ? G : h);
}, last = (h) => h[h.length - 1], chunkBy = (h, W) => h.reduce((h, G) => {
	let K = W(G);
	return h.length === 0 || K ? h.push([G]) : h[h.length - 1].push(G), h;
}, []);
function getOriginX(h) {
	return getX(h) || 0;
}
function getOriginY(h) {
	return getY(h) || 0;
}
function getContentWidth(h) {
	return h.contentWidth || 0;
}
function getContentHeight(h) {
	return h.contentHeight || 0;
}
function placeComponent(h, W, G, K) {
	return {
		id: h.id,
		x: calculateMoveX(h, W, K),
		y: calculateMoveY(h, G, K)
	};
}
function createFlowOverflowContext(h, W) {
	return {
		contentWidth: h,
		paddingLeft: getPaddingLeft(W),
		paddingRight: getPaddingRight(W)
	};
}
function testIfComponentsOverflow(h) {
	let W = h.paddingLeft, G = 0, K = h.contentWidth, q = !1;
	return (J) => {
		if (getPosition(J) === "absolute") return !1;
		let Y = Math.max(W, getMarginLeft(J)) + getWidth(J);
		if (q) return q = getBreakAfter(J), G = Y, W = h.paddingLeft, !0;
		q = getBreakAfter(J);
		let X = G + getLayoutWidth(J) + h.paddingLeft + h.paddingRight;
		return G > 0 && X > K ? (G = Y, W = h.paddingLeft, !0) : (G += Y, W = getMarginRight(J), !1);
	};
}
function evaluateRowWidth(h) {
	return ([W, G], K) => {
		let q = Math.max(G, getMarginLeft(K)) + W;
		return h && (q = h(K, q)), getPosition(K) === "absolute" ? [W, G] : [q + getWidth(K), getMarginRight(K)];
	};
}
function arrangeFlowSequence(h, W) {
	let G = [], K = getPaddingTop(W);
	return chunkBy(h, testIfComponentsOverflow(createFlowOverflowContext(getContentWidth(W), W))).filter((h) => h.length > 0).reduce((h, q) => {
		let J = maxBy(q, (h) => getLayoutHeight(h)), Y = getHeight(J), X = Math.max(K, getMarginTop(J)) + h;
		K = getMarginBottom(J);
		let Z = last(q), [Q] = q.reduce(evaluateRowWidth(void 0), [0, getPaddingLeft(W)]), $ = Q + Math.max(getMarginRight(Z), getPaddingRight(W));
		return q.reduce(evaluateRowWidth((h, K) => {
			let J = getOriginX(W) + K;
			switch (getJustifyContent(W)) {
				case "spaceBetween":
					q.length > 1 && !getBreakAfter(Z) && (K += (getWidth(W) - $) / (q.length - 1));
					break;
				case "center":
					J += (getWidth(W) - $) / 2;
					break;
				case "right":
					J += getWidth(W) - $;
					break;
			}
			let Q = getOriginY(W) + X;
			switch (getAlignItems(W)) {
				case "center":
					Q += (Y - getHeight(h)) / 2;
					break;
				case "bottom":
					Q += Y - getHeight(h);
					break;
			}
			return G.push(getPosition(h) === "absolute" ? placeComponent(h, getOriginX(W), getOriginY(W), W) : placeComponent(h, J, Q, W)), K;
		}), [0, getPaddingLeft(W)]), X + Y;
	}, 0), G;
}
function measureFlowSequence(h, W) {
	let G = getPaddingTop(W), K = W.rawWidth || 0, q = chunkBy(h, testIfComponentsOverflow(createFlowOverflowContext(K, W))).filter((h) => h.length > 0).reduce((h, W) => {
		let K = maxBy(W, (h) => getLayoutHeight(h));
		if (getPosition(K) === "absolute") return h;
		let q = Math.max(G, getMarginTop(K)) + h;
		return G = getMarginBottom(K), q + getHeight(K);
	}, 0) + Math.max(G, getPaddingBottom(W));
	return {
		id: W.id,
		contentWidth: K,
		contentHeight: q
	};
}
function arrangeVerticalBoxSequence(h, W) {
	let G = [], K = getPaddingTop(W);
	return h.reduce((q, J) => {
		let Y = Math.max(getPaddingLeft(W), getMarginLeft(J)), X = Math.max(getPaddingRight(W), getMarginRight(J)), Z = Math.max(K, getMarginTop(J)) + q, Q = getOriginX(W) + Y;
		switch (getJustifyContent(W)) {
			case "center":
				Q += (getWidth(W) - Y - X - getWidth(J)) / 2;
				break;
			case "right":
				Q += getWidth(W) - Y - X - getWidth(J);
				break;
		}
		let $ = getOriginY(W) + Z;
		switch (getAlignItems(W)) {
			case "spaceBetween":
				W.rawHeight && h.length > 1 && (Z += (W.rawHeight - getContentHeight(W)) / (h.length - 1));
				break;
			case "center":
				$ += W.rawHeight ? (W.rawHeight - getContentHeight(W)) / 2 : 0;
				break;
			case "bottom":
				$ += W.rawHeight ? W.rawHeight - getContentHeight(W) : 0;
				break;
		}
		return G.push(getPosition(J) === "absolute" ? placeComponent(J, getOriginX(W), getOriginY(W), W) : placeComponent(J, Q, $, W)), getPosition(J) === "absolute" ? q : (K = getMarginBottom(J), Z + getHeight(J));
	}, 0), G;
}
function measureVerticalBoxSequence(h, W) {
	let G = getPaddingTop(W), K = h.reduce((h, W) => {
		let K = Math.max(G, getMarginTop(W)) + h;
		return getPosition(W) === "absolute" ? h : (G = getMarginBottom(W), K + getHeight(W));
	}, 0) + Math.max(G, getPaddingBottom(W)), q = maxBy(h, (h) => getLayoutWidth(h));
	return {
		id: W.id,
		contentHeight: K,
		...q ? { contentWidth: getWidth(q) + Math.max(getMarginLeft(q), getPaddingLeft(W)) + Math.max(getMarginRight(q), getPaddingRight(W)) } : {}
	};
}
function arrangeHorizontalBoxSequence(h, W) {
	let G = [], K = getPaddingLeft(W);
	return h.reduce((q, J) => {
		let Y = Math.max(K, getMarginLeft(J)) + q, X = Math.max(getPaddingTop(W), getMarginTop(J)), Z = getOriginX(W) + Y;
		switch (getJustifyContent(W)) {
			case "spaceBetween":
				W.rawWidth && h.length > 1 && (Y += (W.rawWidth - getContentWidth(W)) / (h.length - 1));
				break;
			case "center":
				Z += W.rawWidth ? (W.rawWidth - getContentWidth(W)) / 2 : 0;
				break;
			case "right":
				Z += W.rawWidth ? W.rawWidth - getContentWidth(W) : 0;
				break;
		}
		let Q = getOriginY(W) + X;
		switch (getAlignItems(W)) {
			case "center":
				Q += (getHeight(W) - Math.max(getPaddingTop(W), getMarginTop(J)) - Math.max(getPaddingBottom(W), getMarginBottom(J)) - getHeight(J)) / 2;
				break;
			case "bottom":
				Q += getHeight(W) - Math.max(getPaddingTop(W), getMarginTop(J)) - Math.max(getPaddingBottom(W), getMarginBottom(J)) - getHeight(J);
				break;
		}
		return G.push(getPosition(J) === "absolute" ? placeComponent(J, getOriginX(W), getOriginY(W), W) : placeComponent(J, Z, Q, W)), getPosition(J) === "absolute" ? q : (K = getMarginRight(J), Y + getWidth(J));
	}, 0), G;
}
function measureHorizontalBoxSequence(h, W) {
	let G = getPaddingLeft(W), K = h.reduce((h, W) => {
		if (getPosition(W) === "absolute") return h;
		let K = Math.max(G, getMarginLeft(W)) + h;
		return G = getMarginRight(W), K + getWidth(W);
	}, 0) + Math.max(G, getPaddingRight(W)), q = maxBy(h, (h) => getLayoutHeight(h));
	return {
		id: W.id,
		contentWidth: K,
		...q ? { contentHeight: getHeight(q) + Math.max(getMarginTop(q), getPaddingTop(W)) + Math.max(getMarginBottom(q), getPaddingBottom(W)) } : {}
	};
}
function hasComponents(h) {
	return "components" in h && Array.isArray(h.components);
}
function resizeLayoutChild(h, W) {
	applyResize(h, resize(h, W)), hasComponents(h) && resizeContainer(h, W);
}
function applyArrangePatches(h, W) {
	h.components.forEach((G, K) => {
		let q = W[K];
		applyMove(G, q), hasComponents(G) && moveContainer(G, q.x, q.y, h);
	});
}
function applyMeasurePatch(h, W) {
	W.contentWidth !== void 0 && (h.contentWidth = W.contentWidth), W.contentHeight !== void 0 && (h.contentHeight = W.contentHeight);
}
function resizeContainer(h, W) {
	switch (getLayout(h)) {
		case "flow":
			resizeComponentsForFlowLayout(h, W);
			break;
		case "horizontalBox":
			resizeComponentsForHorizontalBox(h, W);
			break;
		case "verticalBox":
			resizeComponentsForVerticalBox(h, W);
			break;
		default: break;
	}
}
function moveContainer(h, W = 0, G = 0, K) {
	switch (getLayout(h)) {
		case "flow":
			moveComponentsForFlowLayout(h, W, G, K);
			break;
		case "horizontalBox":
			moveComponentsForHorizontalBox(h, W, G, K);
			break;
		case "verticalBox":
			moveComponentsForVerticalBox(h, W, G, K);
			break;
		default: break;
	}
}
function relayoutContainer(h, W = 0, G = 0, K) {
	applyResize(h, resize(h, K)), resizeContainer(h, K), applyMove(h, move(h, W, G, K)), moveContainer(h, W, G, K);
}
function resizeComponentsForFlowLayout(h, W) {
	h.components.forEach((W) => {
		resizeLayoutChild(W, h);
	}), applyMeasurePatch(h, measureFlowSequence(h.components, h));
}
function moveComponentsForFlowLayout(h, W = 0, G = 0, K) {
	applyArrangePatches(h, arrangeFlowSequence(h.components, h));
}
function resizeComponentsForVerticalBox(h, W) {
	h.components.forEach((W) => {
		resizeLayoutChild(W, h);
	}), applyMeasurePatch(h, measureVerticalBoxSequence(h.components, h));
}
function moveComponentsForVerticalBox(h, W = 0, G = 0, K) {
	applyArrangePatches(h, arrangeVerticalBoxSequence(h.components, h));
}
function resizeComponentsForHorizontalBox(h, W) {
	h.components.forEach((W) => {
		resizeLayoutChild(W, h);
	}), applyMeasurePatch(h, measureHorizontalBoxSequence(h.components, h));
}
function moveComponentsForHorizontalBox(h, W = 0, G = 0, K) {
	applyArrangePatches(h, arrangeHorizontalBoxSequence(h.components, h));
}
export { addComponent, applyMove, applyResize, arrangeFlowSequence, arrangeHorizontalBoxSequence, arrangeVerticalBoxSequence, createComponent, createContainer, createStyle, findComponent, getHeight, getVisible, getWidth, getX, getY, measureFlowSequence, measureHorizontalBoxSequence, measureVerticalBoxSequence, move, moveContainer, normalizeBoxSpacing, relayoutContainer, resize, resizeContainer, setMargin, setPadding };
