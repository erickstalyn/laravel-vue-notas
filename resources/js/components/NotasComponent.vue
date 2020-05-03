<template>
    <div>
        <form class="mb-3" @submit.prevent="editNota(nota)" v-if="editarActivo">
            <h2>Editar notas</h2>
            <input type="text" placeholder="Nombre" class="form-control mb-2" v-model="nota.nombre">
            <input type="text" placeholder="Descripción" class="form-control mb-2" v-model="nota.descripcion">
            <button class="btn btn-success" type="submit">Guardar</button>
            <button class="btn btn-secondary" @click="cancelEdit">Cancelar</button>
        </form>
        <form class="mb-3" @submit.prevent="agregar" v-else>
            <h2>Agregar notas</h2>
            <input type="text" placeholder="Nombre" class="form-control mb-2" v-model="nota.nombre">
            <input type="text" placeholder="Descripción" class="form-control mb-2" v-model="nota.descripcion">
            <button class="btn btn-primary" type="submit">Agregar</button>
        </form>
        <h2>Listado de notas</h2>
        <ul class="list-group">
            <li class="list-group-item"
            v-for="(item, index) in notas" :key="index">
                <span class="badge badge-primary float-right">{{item.updated_at}}</span>
                <p>{{item.nombre}}</p>
                <p>{{item.descripcion}}</p>
                <button class="btn btn-danger btn-sm float-right" @click="deleteNota(item, index)">Eliminar</button>
                <button class="btn btn-warning btn-sm float-left" @click="editForm(item)">Editar</button>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data(){
        return {
            notas: [],
            nota: {nombre: '', descripcion: ''},
            editarActivo: false
        }
    },
    methods: {
        getNotas(){
            axios.get('/notas')
            .then(res => {
                this.notas = res.data;
                // console.log(this.notas)
            }).catch(err => {

            });
        },
        agregar(){
            //validamos que los campos no este vacios
            if(this.nota.nombre == '' || this.nota.descripcion == ''){
                alert('Debes completar todos los campos antes de guardar');
                return;
            }
            const params = {nombre: this.nota.nombre, descripcion: this.nota.descripcion};
            this.clearForm();

            axios.post('/notas', params)
            .then((res) => {
                this.notas.push(res.data);
            }).catch((err) => {
            });
        },
        editForm(item){
            this.editarActivo = true;
            this.nota.nombre = item.nombre;
            this.nota.descripcion = item.descripcion;
            this.nota.id = item.id;
        },
        editNota(item){
            const params = {nombre: item.nombre, descripcion: item.descripcion, id: item.id};
            axios.put(`/notas/${item.id}`, params)
            .then(res => {
                const index = this.notas.findIndex(nota => nota.id === res.data.id);
                this.clearForm();
                this.editarActivo = false;
                this.notas[index].nombre = res.data.nombre;
                this.notas[index].descripcion = res.data.descripcion;
                this.notas[index].updated_at = res.data.updated_at;
            }).catch(err => {

            });
        },
        cancelEdit(){
            this.editarActivo = false;
            this.clearForm();
        },
        deleteNota(item, index){
            axios.delete(`/notas/${item.id}`)
            .then(res => {
                this.notas.splice(index, 1);
            }).catch(err => {
            });
        },
        clearForm(){
            this.nota.nombre = '';
            this.nota.descripcion = '';
        }
    },
    created(){
        this.getNotas();
    }
}
</script>