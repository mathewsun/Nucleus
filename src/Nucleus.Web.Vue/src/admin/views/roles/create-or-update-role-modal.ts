import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import RoleAppService from '../../../services/role-app-service';

@Component
export default class CreateOrUpdateRoleModalComponent extends Vue {

    public isUpdate = false;
    public getRoleForCreateOrUpdateOutput = {};
    public createOrUpdateRoleInput = {
        grantedPermissionIds: [],
        role: {
            id: '',
            name: '',
            isSystemDefault: false,
        } as IRoleDto,
    } as ICreateOrUpdateRoleInput;
    public errors: IErrorResponse[] = [];
    public roleAppService = new RoleAppService();

    public createOrUpdateRoleModalShown() {
        this.roleAppService.getRoleForCreateOrUpdate(this.$parent.getRoleForCreateOrUpdateInput).then((response) => {
            const result = response.content as IGetRoleForCreateOrUpdateOutput;
            this.isUpdate = result.role.name != null;
            this.getRoleForCreateOrUpdateOutput = result;
            this.createOrUpdateRoleInput = {
                grantedPermissionIds: result.grantedPermissionIds,
                role: result.role,
            };
        });
    }

    public onSubmit(isUpdate:boolean) {
        this.roleAppService.createOrUpdateRole(this.createOrUpdateRoleInput as ICreateOrUpdateRoleInput).then((response) => {
            if (!response.isError) {
                this.$refs.modalCreateOrUpdateRole.hide();
                this.$parent.getRoles();
            } else {
                this.errors = response.errors;
            }
        });
    }
}