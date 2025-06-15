
/**
 * Config for dry run/testing AI extraction pipeline.
 * If DRY_RUN is true, transcript tasks won't be saved to DB.
 */
export const aiPipelineConfig = {
  DRY_RUN: false, // set true for pre-production/internal testing
};
