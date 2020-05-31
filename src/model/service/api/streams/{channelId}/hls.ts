import { Operation } from 'express-openapi';
import IStreamApiModel from '../../../../api/stream/IStreamApiModel';
import container from '../../../../ModelContainer';
import * as api from '../../../api';

export const get: Operation = async (req, res) => {
    const streamApiModel = container.get<IStreamApiModel>('IStreamApiModel');

    try {
        const streamId = await streamApiModel.startHLSStream({
            channelId: parseInt(req.params.channelId, 10),
            name: req.query.name as string,
        });
        api.responseJSON(res, 200, {
            streamId: streamId,
        });
    } catch (err) {
        api.responseServerError(res, err.message);
    }
};

get.apiDoc = {
    summary: 'ライブ HLS ストリーム',
    tags: ['streams'],
    description: 'ライブ HLS ストリームを開始する',
    parameters: [
        {
            $ref: '#/components/parameters/PathChannelId',
        },
        {
            $ref: '#/components/parameters/StreamName',
        },
    ],
    responses: {
        200: {
            description: 'ライブ HLS ストリームを開始しました',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/StartStreamInfo',
                    },
                },
            },
        },
        default: {
            description: '予期しないエラー',
            content: {
                'application/json': {
                    schema: {
                        $ref: '#/components/schemas/Error',
                    },
                },
            },
        },
    },
};