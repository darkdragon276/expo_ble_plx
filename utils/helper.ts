const normalizeAngle = (alpha: number): number => {
    alpha = ((alpha + 180) % 360 + 360) % 360;
    return alpha - 180;
};


export { normalizeAngle }