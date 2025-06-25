#!/bin/bash
cd /home/kavia/workspace/code-generation/sleektictactoe-59740-7e450c01/tic_tac_toe_frontend_workspace/tic_tac_toe_frontend
npm run lint
ESLINT_EXIT_CODE=$?
npm run build
BUILD_EXIT_CODE=$?
if [ $ESLINT_EXIT_CODE -ne 0 ] || [ $BUILD_EXIT_CODE -ne 0 ]; then
   exit 1
fi

