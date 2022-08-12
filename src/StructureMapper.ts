export type StructureMapper = {
    [key: string]: string | StructureMapper;
};

export const mappersAreEqual = (mapper1: StructureMapper, mapper2: StructureMapper) =>
    JSON.stringify(mapper1) === JSON.stringify(mapper2);
