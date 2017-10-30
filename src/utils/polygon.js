import Polygon from 'polygon'
import Vec2 from 'vec2'

export function hintTest(polygon, point) {
	return (new Polygon(polygon.poly)).containsPoint(Vec2(point[0], point[1]))
}

export function findIndex(polygons, point) {
	let reverseIndex = polygons.slice().reverse().findIndex(
		polygon => hintTest(polygon, point)
	)
	return reverseIndex < 0 ? -1 : (polygons.length - reverseIndex - 1)
}

export function hintMap(doc, index, point) {
	let map = doc.state.maps[index]
	if (!map) {
		return false
	}
	return hintTest(map, point)
}

export function hintMaps(doc, point) {
	return findIndex(doc.state.maps, point)
}

export function hintSelectedMaps(doc, point) {
	return findIndex(doc.state.maps.filter(
		(p, i) => doc.selectedObjects.maps.indexOf(i) > -1
	), point)
}