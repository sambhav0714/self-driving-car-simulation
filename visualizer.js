class Visualizer {
    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - margin * 2;
        const height = ctx.canvas.height - margin * 2;

        const levelHeight = height / network.levels.length;

        for (let i = network.levels.length - 1; i >= 0; i--) {
            const levelTop = top + lerp(
                height - levelHeight,
                0,
                network.levels.length == 1 ? 0.5 : i / (network.levels.length - 1)
            );

            ctx.setLineDash([7, 3]);
            Visualizer.drawLevel(ctx, network.levels[i],
                left, levelTop,
                width, levelHeight,
                i == network.levels.length - 1 ? ['🠉', '🠈', '🠊', '🠋'] : []
            );
        }
    }

    static drawLevel(ctx, level, left, top, width, height, outputLabels) {
        const right = left + width;
        const bottom = top + height;

        const nodeRadius = 18;

        // Draw connections
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.getNodeX(level.inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.getNodeX(level.outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(level.weights[i][j]);
                ctx.stroke();
            }
        }

        // Draw input nodes
        for (let i = 0; i < level.inputs.length; i++) {
            const x = Visualizer.getNodeX(level.inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(level.inputs[i]);
            ctx.fill();
        }

        // Draw output nodes
        for (let i = 0; i < level.outputs.length; i++) {
            const x = Visualizer.getNodeX(level.outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(level.outputs[i]);
            ctx.fill();

            if (outputLabels[i]) {
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.font = (nodeRadius * 1.5) + "px Arial";
                ctx.fillText(outputLabels[i], x, top);
                ctx.lineWidth = 0.5;
                ctx.strokeText(outputLabels[i], x, top);
            }
        }
    }

    static getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
        );
    }
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}