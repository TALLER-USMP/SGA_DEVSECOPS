import { relations } from "drizzle-orm/relations";
import {
  silaboUnidad,
  silaboUnidadContenido,
  silaboUnidadSemana,
  silabo,
  silaboEvaluacion,
  silaboFuente,
  usuarioAutorizado,
  silaboResultadoAprendizajeCurso,
  categoriaUsuario,
  categoriaFuncionAcceso,
  funcionAplicacion,
  silaboAporteResultadoPrograma,
} from "./schema";

export const silaboUnidadContenidoRelations = relations(
  silaboUnidadContenido,
  ({ one }) => ({
    silaboUnidad: one(silaboUnidad, {
      fields: [silaboUnidadContenido.silaboUnidadId],
      references: [silaboUnidad.id],
    }),
  }),
);

export const silaboUnidadRelations = relations(
  silaboUnidad,
  ({ one, many }) => ({
    silaboUnidadContenidos: many(silaboUnidadContenido),
    silaboUnidadSemanas: many(silaboUnidadSemana),
    silabo: one(silabo, {
      fields: [silaboUnidad.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const silaboUnidadSemanaRelations = relations(
  silaboUnidadSemana,
  ({ one }) => ({
    silaboUnidad: one(silaboUnidad, {
      fields: [silaboUnidadSemana.silaboUnidadId],
      references: [silaboUnidad.id],
    }),
  }),
);

export const silaboEvaluacionRelations = relations(
  silaboEvaluacion,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboEvaluacion.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const silaboRelations = relations(silabo, ({ one, many }) => ({
  silaboEvaluacions: many(silaboEvaluacion),
  silaboFuentes: many(silaboFuente),
  usuarioAutorizado_actualizadoPorUsuarioAutorizadoId: one(usuarioAutorizado, {
    fields: [silabo.actualizadoPorUsuarioAutorizadoId],
    references: [usuarioAutorizado.id],
    relationName:
      "silabo_actualizadoPorUsuarioAutorizadoId_usuarioAutorizado_id",
  }),
  usuarioAutorizado_asignadoAUsuarioAutorizadoId: one(usuarioAutorizado, {
    fields: [silabo.asignadoAUsuarioAutorizadoId],
    references: [usuarioAutorizado.id],
    relationName: "silabo_asignadoAUsuarioAutorizadoId_usuarioAutorizado_id",
  }),
  usuarioAutorizado_creadoPorUsuarioAutorizadoId: one(usuarioAutorizado, {
    fields: [silabo.creadoPorUsuarioAutorizadoId],
    references: [usuarioAutorizado.id],
    relationName: "silabo_creadoPorUsuarioAutorizadoId_usuarioAutorizado_id",
  }),
  silaboResultadoAprendizajeCursos: many(silaboResultadoAprendizajeCurso),
  silaboUnidads: many(silaboUnidad),
  silaboAporteResultadoProgramas: many(silaboAporteResultadoPrograma),
}));

export const silaboFuenteRelations = relations(silaboFuente, ({ one }) => ({
  silabo: one(silabo, {
    fields: [silaboFuente.silaboId],
    references: [silabo.id],
  }),
}));

export const usuarioAutorizadoRelations = relations(
  usuarioAutorizado,
  ({ one, many }) => ({
    silabos_actualizadoPorUsuarioAutorizadoId: many(silabo, {
      relationName:
        "silabo_actualizadoPorUsuarioAutorizadoId_usuarioAutorizado_id",
    }),
    silabos_asignadoAUsuarioAutorizadoId: many(silabo, {
      relationName: "silabo_asignadoAUsuarioAutorizadoId_usuarioAutorizado_id",
    }),
    silabos_creadoPorUsuarioAutorizadoId: many(silabo, {
      relationName: "silabo_creadoPorUsuarioAutorizadoId_usuarioAutorizado_id",
    }),
    categoriaUsuario: one(categoriaUsuario, {
      fields: [usuarioAutorizado.categoriaUsuarioId],
      references: [categoriaUsuario.id],
    }),
  }),
);

export const silaboResultadoAprendizajeCursoRelations = relations(
  silaboResultadoAprendizajeCurso,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboResultadoAprendizajeCurso.silaboId],
      references: [silabo.id],
    }),
  }),
);

export const categoriaUsuarioRelations = relations(
  categoriaUsuario,
  ({ many }) => ({
    usuarioAutorizados: many(usuarioAutorizado),
    categoriaFuncionAccesos: many(categoriaFuncionAcceso),
  }),
);

export const categoriaFuncionAccesoRelations = relations(
  categoriaFuncionAcceso,
  ({ one }) => ({
    categoriaUsuario: one(categoriaUsuario, {
      fields: [categoriaFuncionAcceso.categoriaUsuarioId],
      references: [categoriaUsuario.id],
    }),
    funcionAplicacion: one(funcionAplicacion, {
      fields: [categoriaFuncionAcceso.funcionAplicacionId],
      references: [funcionAplicacion.id],
    }),
  }),
);

export const funcionAplicacionRelations = relations(
  funcionAplicacion,
  ({ many }) => ({
    categoriaFuncionAccesos: many(categoriaFuncionAcceso),
  }),
);

export const silaboAporteResultadoProgramaRelations = relations(
  silaboAporteResultadoPrograma,
  ({ one }) => ({
    silabo: one(silabo, {
      fields: [silaboAporteResultadoPrograma.silaboId],
      references: [silabo.id],
    }),
  }),
);
